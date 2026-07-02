export const API_URL = "https://script.google.com/macros/s/AKfycby_appOplZ6VpSn2wUyyC_cHS169w4FdNAQcLHhKQg-m_piqDHr4sryZ8oJjbQmK7wh-A/exec";

// Mock backend using localStorage for now
function mockBackend(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let users = JSON.parse(localStorage.getItem("mock_db_users") || "{}");
      let publicData = JSON.parse(localStorage.getItem("mock_db_public") || '{"artists": {}, "comments": {}}');
      let requests = JSON.parse(localStorage.getItem("mock_db_requests") || "{}");
      let linkedUsers = JSON.parse(localStorage.getItem("mock_db_linked") || "{}");

      // Set first user to moderator for local testing if no admin exists
      if (Object.keys(users).length === 0) {
          // You can register to become the first admin
      }

      const ensureModerator = (user) => {
         if (Object.keys(users).length === 1) return 'moderator';
         return user.role;
      };

      if (payload.action === 'login') {
        const user = users[payload.username];
        if (user && user.password === payload.password) {
          user.role = ensureModerator(user);
          // Sync local data if provided
          if (payload.localData) {
              if (!user.data) user.data = payload.localData;
              localStorage.setItem("mock_db_users", JSON.stringify(users));
          }
          resolve({ success: true, user: { username: user.username, role: user.role, token: user.token, linkedArtistId: linkedUsers[user.username] }, userData: user.data });
        } else {
          resolve({ success: false, error: "Неверный логин или пароль" });
        }
      } 
      else if (payload.action === 'register') {
        if (users[payload.username]) {
          resolve({ success: false, error: "Пользователь уже существует" });
        } else {
          const isFirstUser = Object.keys(users).length === 0;
          const user = { username: payload.username, password: payload.password, role: isFirstUser ? 'moderator' : 'user', token: Math.random().toString(36).substr(2), data: payload.localData };
          users[payload.username] = user;
          localStorage.setItem("mock_db_users", JSON.stringify(users));
          resolve({ success: true, user: { username: user.username, role: user.role, token: user.token, linkedArtistId: undefined }, userData: user.data });
        }
      }
      else if (payload.action === 'getPublicData') {
         const dataCopy = JSON.parse(JSON.stringify(publicData));
         dataCopy.verifiedArtists = Object.values(linkedUsers);
         resolve({ success: true, data: dataCopy });
      }
      else if (payload.action === 'getMGRVotes') {
         let mgrVotes = JSON.parse(localStorage.getItem("mock_db_mgr_votes") || "{}");
         let totalVotes = {};
         let myVotes = mgrVotes[payload.username] || {};
         
         for (const [user, votes] of Object.entries(mgrVotes)) {
             for (const [revId, count] of Object.entries(votes)) {
                 totalVotes[revId] = (totalVotes[revId] || 0) + count;
             }
         }
         resolve({ success: true, totalVotes, myVotes });
      }
      else if (payload.action === 'submitMGRVotes') {
         let mgrVotes = JSON.parse(localStorage.getItem("mock_db_mgr_votes") || "{}");
         mgrVotes[payload.username] = payload.votes;
         localStorage.setItem("mock_db_mgr_votes", JSON.stringify(mgrVotes));
         resolve({ success: true });
      }
      else if (payload.action === 'updateArtistInfo') {
         const { username, description, pinnedReleaseId } = payload;
         const aId = linkedUsers[username];
         if (!aId) return resolve({ success: false, error: "Нет привязанного артиста" });
         if (!publicData.artists[aId]) publicData.artists[aId] = {};
         publicData.artists[aId].description = description;
         publicData.artists[aId].pinnedReleaseId = pinnedReleaseId;
         localStorage.setItem("mock_db_public", JSON.stringify(publicData));
         resolve({ success: true });
      }
      else if (payload.action === 'submitEventReview') {
         let eventReviews = JSON.parse(localStorage.getItem("mock_db_event_reviews") || "[]");
         
         const isDuplicateRelease = eventReviews.some(r => r.artist.toLowerCase() === payload.review.artist.toLowerCase() && r.title.toLowerCase() === payload.review.title.toLowerCase());
         if (isDuplicateRelease) {
             return resolve({ success: false, error: "Этот релиз уже был отправлен кем-то другим." });
         }

         const isDuplicateUser = eventReviews.some(r => r.username === payload.username);
         if (isDuplicateUser) {
             return resolve({ success: false, error: "Вы уже отправили рецензию." });
         }

         eventReviews.push({ ...payload.review, username: payload.username });
         localStorage.setItem("mock_db_event_reviews", JSON.stringify(eventReviews));
         resolve({ success: true });
      }
      else if (payload.action === 'addComment') {
         const { username, reviewId, commentText } = payload;
         const aId = linkedUsers[username];
         if (!aId) return resolve({ success: false, error: "Нет привязанного артиста" });
         if (!publicData.comments[reviewId]) publicData.comments[reviewId] = [];
         publicData.comments[reviewId] = publicData.comments[reviewId].filter(x => x.artistId !== aId);
         if (commentText && commentText.trim() !== '') {
             publicData.comments[reviewId].push({ artistId: aId, text: commentText });
         }
         localStorage.setItem("mock_db_public", JSON.stringify(publicData));
         resolve({ success: true });
      }
      else if (payload.action === 'requestLink') {
         requests[payload.username] = payload.artistId;
         localStorage.setItem("mock_db_requests", JSON.stringify(requests));
         resolve({ success: true });
      }
      else if (payload.action === 'getAdminData') {
         const user = users[payload.username];
         if(!user || user.role !== 'moderator') return resolve({ success: false, error: "Access denied" });
         
         const requestsArr = Object.keys(requests).map(u => ({ username: u, artistId: requests[u] }));
         const linkedArr = Object.keys(linkedUsers).map(u => ({ username: u, artistId: linkedUsers[u] }));
         
         resolve({ success: true, requests: requestsArr, linked: linkedArr });
      }
      else if (payload.action === 'approveLink') {
         const user = users[payload.username];
         if(!user || user.role !== 'moderator') return resolve({ success: false, error: "Access denied" });
         const targetUser = payload.targetUser;
         const aId = payload.artistId;
         linkedUsers[targetUser] = aId;
         delete requests[targetUser];
         localStorage.setItem("mock_db_linked", JSON.stringify(linkedUsers));
         localStorage.setItem("mock_db_requests", JSON.stringify(requests));
         resolve({ success: true });
      }
      else if (payload.action === 'rejectLink') {
          const user = users[payload.username];
         if(!user || user.role !== 'moderator') return resolve({ success: false, error: "Access denied" });
          delete requests[payload.targetUser];
          localStorage.setItem("mock_db_requests", JSON.stringify(requests));
          resolve({ success: true });
      }
      else if (payload.action === 'unlinkAccount') {
         const user = users[payload.username];
         if(!user || user.role !== 'moderator') return resolve({ success: false, error: "Access denied" });
         delete linkedUsers[payload.targetUser];
         localStorage.setItem("mock_db_linked", JSON.stringify(linkedUsers));
         resolve({ success: true });
      }
      else if (payload.action === 'resignModerator') {
         const user = users[payload.username];
         if(user) {
             user.role = 'user';
             localStorage.setItem("mock_db_users", JSON.stringify(users));
         }
         resolve({ success: true });
      }
      else if (payload.action === 'getUsersList') {
         const user = users[payload.username];
         if(!user || user.role !== 'moderator') return resolve({ success: false, error: "Access denied" });
         
         const userList = Object.keys(users).filter(u => u !== payload.username);
         resolve({ success: true, data: userList });
      }
      else if (payload.action === 'transferModerator') {
         const user = users[payload.username];
         if(!user || user.role !== 'moderator') return resolve({ success: false, error: "Access denied" });
         
         const targetUser = users[payload.targetUser];
         if(!targetUser) return resolve({ success: false, error: "Пользователь не найден" });
         
         targetUser.role = 'moderator';
         user.role = 'user';
         localStorage.setItem("mock_db_users", JSON.stringify(users));
         resolve({ success: true });
      }
      else if (payload.action === 'syncUserData') {
          const user = users[payload.username];
          if (user && user.token === payload.token) {
              user.data = payload.localData;
              localStorage.setItem("mock_db_users", JSON.stringify(users));
              resolve({ success: true });
          } else {
              resolve({ success: false, error: "Access denied" });
          }
      }
      else if (payload.action === 'checkSession') {
          const user = users[payload.username];
          if (user && user.token === payload.token) {
              resolve({ 
                  success: true, 
                  user: { username: user.username, role: user.role, token: user.token, linkedArtistId: linkedUsers[user.username] } 
              });
          } else {
              resolve({ success: false, error: "Access denied" });
          }
      }
      else {
        resolve({ success: false, error: "Unknown action" });
      }
    }, 500);
  });
}

export async function callApi(payload) {
  if (API_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
    // Fallback to local mock if URL is not yet configured
    console.log("API_URL is not set. Using mock backend.");
    return await mockBackend(payload);
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("API call error:", e);
    return { success: false, error: e.message || "Ошибка соединения с сервером" };
  }
}

export function getCurrentUser() {
  const user = localStorage.getItem("hf_user");
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem("hf_user", JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem("hf_user");
}

export async function syncUserLocalData() {
  const user = getCurrentUser();
  if (user) {
    const localData = {
      userRatings: localStorage.getItem("userRatings") || "{}",
      subscribedArtists: localStorage.getItem("subscribedArtists") || "[]",
      huev_2026_watched: localStorage.getItem("huev_2026_watched") || "",
      reviewNotes: localStorage.getItem("reviewNotes") || "{}",
      myGlobalReview: localStorage.getItem("myGlobalReview") || "{}"
    };
    await callApi({
        action: 'syncUserData',
        username: user.username,
        token: user.token,
        localData: JSON.stringify(localData)
    });
  }
}

export async function refreshSession() {
  const user = getCurrentUser();
  if (!user) return false;
  try {
    const res = await callApi({ action: 'checkSession', username: user.username, token: user.token });
    if (res.success && res.user) {
       const beforeLinked = user.linkedArtistId;
       const beforeRole = user.role;
       setCurrentUser(res.user);
       if (beforeLinked !== res.user.linkedArtistId || beforeRole !== res.user.role) {
           return true;
       }
    }
  } catch(e) { console.error(e); }
  return false;
}
