import { supabase } from './supabaseClient.js';

export const API_URL = "SUPABASE_BYPASS";

async function checkAuth(payload) {
    let { data: users } = await supabase.from('users').select('*').eq('username', payload.username).eq('token', payload.token).single();
    if (!users) return { success: false, error: "Не авторизован (неверный токен)" };
    return { success: true, user: users };
}

export async function callApi(payload) {
  try {
      if (payload.action === 'login') {
        let { data: users, error } = await supabase.from('users').select('*').eq('username', payload.username);
        if (users && users.length > 0 && String(users[0].password) === String(payload.password)) {
            const user = users[0];
            let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username).single();
            if (payload.localData && !user.data) {
                await supabase.from('users').update({ data: payload.localData }).eq('username', payload.username);
                user.data = payload.localData;
            }
            return { success: true, user: { username: user.username, role: user.role, token: user.token, linkedArtistId: linked ? linked.artist_id : undefined }, userData: user.data };
        }
        return { success: false, error: "Неверный логин или пароль" };
      }
      if (payload.action === 'register') {
        let { data: users } = await supabase.from('users').select('*');
        if (users && users.find(u => u.username === payload.username)) {
           return { success: false, error: "Пользователь уже существует" };
        }
        const isFirst = !users || users.length === 0;
        const newToken = Math.random().toString(36).substring(2);
        const role = isFirst ? 'moderator' : 'user';
        const localDataStr = payload.localData || "";
        await supabase.from('users').insert({ username: payload.username, password: payload.password, role, token: newToken, data: localDataStr });
        return { success: true, user: { username: payload.username, role, token: newToken, linkedArtistId: undefined }, userData: localDataStr };
      }
      if (payload.action === 'getPublicData') {
        let { data: artistRows } = await supabase.from('artist_info').select('*');
        let { data: commentRows } = await supabase.from('comments').select('*');
        let { data: linkedRows } = await supabase.from('linked_users').select('*');
        
        let publicData = { artists: {}, comments: {}, verifiedArtists: [] };
        (artistRows || []).forEach(r => {
           publicData.artists[r.artist_id] = { description: String(r.description || ''), pinnedReleaseId: String(r.pinned_release_id || '') };
        });
        (commentRows || []).forEach(r => {
           if (!publicData.comments[r.review_id]) publicData.comments[r.review_id] = [];
           publicData.comments[r.review_id].push({ artistId: r.artist_id, text: String(r.text), timestamp: r.timestamp });
        });
        (linkedRows || []).forEach(r => {
           if (r.artist_id && !publicData.verifiedArtists.includes(r.artist_id)) {
               publicData.verifiedArtists.push(r.artist_id);
           }
        });
        return { success: true, data: publicData };
      }
      if (payload.action === 'requestLink') {
        let { data: reqs } = await supabase.from('link_requests').select('*').eq('username', payload.username);
        if (reqs && reqs.length > 0) return { success: false, error: "Ваш запрос уже находится на рассмотрении модератора." };
        await supabase.from('link_requests').insert({ username: payload.username, artist_id: payload.artistId });
        return { success: true };
      }
      if (payload.action === 'getAdminData') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        let { data: requests } = await supabase.from('link_requests').select('*');
        let { data: linked } = await supabase.from('linked_users').select('*');
        return {
            success: true,
            requests: (requests || []).map(r => ({ username: r.username, artistId: r.artist_id })),
            linked: (linked || []).map(r => ({ username: r.username, artistId: r.artist_id }))
        };
      }
      if (payload.action === 'approveLink') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        await supabase.from('link_requests').delete().eq('username', payload.targetUser);
        let { data: existing } = await supabase.from('linked_users').select('*').eq('artist_id', payload.artistId).single();
        if (existing) {
            await supabase.from('linked_users').update({ username: payload.targetUser }).eq('artist_id', payload.artistId);
        } else {
            await supabase.from('linked_users').insert({ username: payload.targetUser, artist_id: payload.artistId });
        }
        return { success: true };
      }
      if (payload.action === 'rejectLink') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        await supabase.from('link_requests').delete().eq('username', payload.targetUser);
        return { success: true };
      }
      if (payload.action === 'unlinkAccount') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        await supabase.from('linked_users').delete().eq('username', payload.targetUser);
        return { success: true };
      }
      if (payload.action === 'getUsersList') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        let { data: users } = await supabase.from('users').select('username').neq('username', payload.username);
        return { success: true, data: (users || []).map(u => u.username) };
      }
      if (payload.action === 'transferModerator') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        await supabase.from('users').update({ role: 'user' }).eq('username', payload.username);
        await supabase.from('users').update({ role: 'moderator' }).eq('username', payload.targetUser);
        return { success: true };
      }
      if (payload.action === 'resignModerator') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Нет доступа" };
        await supabase.from('users').update({ role: 'user' }).eq('username', payload.username);
        return { success: true };
      }
      if (payload.action === 'updateArtistInfo') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Нет доступа" };
        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username).single();
        if (!linked) return { success: false, error: "У вас нет привязанного профиля" };
        let { data: existing } = await supabase.from('artist_info').select('*').eq('artist_id', linked.artist_id).single();
        if (existing) {
            await supabase.from('artist_info').update({ description: payload.description, pinned_release_id: payload.pinnedReleaseId }).eq('artist_id', linked.artist_id);
        } else {
            await supabase.from('artist_info').insert({ artist_id: linked.artist_id, description: payload.description, pinned_release_id: payload.pinnedReleaseId });
        }
        return { success: true };
      }
      if (payload.action === 'addComment') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Нет доступа" };
        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username).single();
        if (!linked) return { success: false, error: "У вас нет привязанного профиля" };
        await supabase.from('comments').delete().eq('review_id', payload.reviewId).eq('artist_id', linked.artist_id);
        if (payload.commentText && String(payload.commentText).trim() !== "") {
            await supabase.from('comments').insert({ review_id: payload.reviewId, artist_id: linked.artist_id, text: payload.commentText, timestamp: Date.now() });
        }
        return { success: true };
      }
      if (payload.action === 'submitEventReview') {
        let { data: duplicates } = await supabase.from('event_reviews').select('*').eq('username', payload.username);
        if (duplicates && duplicates.length > 0) return { success: false, error: "Вы уже отправили рецензию." };
        if (payload.review && payload.review.artist && payload.review.title) {
            let { data: relDup } = await supabase.from('event_reviews').select('*').ilike('artist', payload.review.artist).ilike('title', payload.review.title);
            if (relDup && relDup.length > 0) return { success: false, error: "Этот релиз уже был отправлен кем-то другим." };
        }
        await supabase.from('event_reviews').insert({
            review_id: Math.random().toString(36).substring(2),
            username: payload.username,
            artist: payload.review.artist,
            title: payload.review.title,
            type: payload.review.type,
            review_text: payload.review.reviewText,
            date: payload.review.date,
            scores_json: JSON.stringify(payload.review.scores || []),
            tracks_json: JSON.stringify(payload.review.tracks || [])
        });
        return { success: true };
      }
      if (payload.action === 'syncUserData') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Пользователь не найден" };
        await supabase.from('users').update({ data: payload.localData }).eq('username', payload.username);
        return { success: true };
      }
      if (payload.action === 'checkSession') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Не авторизован" };
        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username).single();
        return { success: true, user: { username: auth.user.username, role: auth.user.role, token: auth.user.token, linkedArtistId: linked ? linked.artist_id : undefined } };
      }
      if (payload.action === 'getMGRVotes') {
        let { data: mgrVotes } = await supabase.from('mgr_votes').select('*');
        let totalVotes = {};
        let myVotes = {};
        (mgrVotes || []).forEach(r => {
            try {
                const obj = JSON.parse(r.votes_json);
                if (r.username === payload.username) myVotes = obj;
                for (const [revId, count] of Object.entries(obj)) {
                    totalVotes[revId] = (totalVotes[revId] || 0) + Number(count);
                }
            } catch(e) {}
        });
        return { success: true, totalVotes, myVotes };
      }
      if (payload.action === 'submitMGRVotes') {
        if (!payload.username) return { success: false, error: "Необходима авторизация" };
        let { data: existing } = await supabase.from('mgr_votes').select('*').eq('username', payload.username).single();
        if (existing) {
            await supabase.from('mgr_votes').update({ votes_json: JSON.stringify(payload.votes) }).eq('username', payload.username);
        } else {
            await supabase.from('mgr_votes').insert({ username: payload.username, votes_json: JSON.stringify(payload.votes) });
        }
        return { success: true };
      }
      if (payload.action === 'getUssData') {
        let { data: existing } = await supabase.from('uss_civil_war').select('*').eq('username', payload.username).single();
        if (existing) {
            try { return { success: true, data: JSON.parse(existing.data_json) }; } catch(e) { return { success: true, data: null }; }
        }
        return { success: true, data: null };
      }
      if (payload.action === 'saveUssData') {
        if (!payload.username) return { success: false, error: "Необходима авторизация" };
        let { data: existing } = await supabase.from('uss_civil_war').select('*').eq('username', payload.username).single();
        if (existing) {
            await supabase.from('uss_civil_war').update({ data_json: JSON.stringify(payload.data) }).eq('username', payload.username);
        } else {
            await supabase.from('uss_civil_war').insert({ username: payload.username, data_json: JSON.stringify(payload.data) });
        }
        return { success: true };
      }
      if (payload.action === 'getUserEconomy') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        const user = auth.user;
        let hc = Number(user.hue_coins) || 0;
        let rc = user.registered_claimed === true || String(user.registered_claimed).toLowerCase() === 'true';
        let rawDate = user.last_bonus_date;
        let lastBonus = String(rawDate || "");
        const now = new Date();
        const today = new Date(now.getTime() + 3 * 3600 * 1000).toISOString().split("T")[0];
        const canClaimDaily = rc && lastBonus !== today;
        const canClaimRegister = !rc;
        return { success: true, hueCoins: hc, canClaimRegister, canClaimDaily };
      }
      if (payload.action === 'claimBonus') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        const user = auth.user;
        let hc = Number(user.hue_coins) || 0;
        let rc = user.registered_claimed === true || String(user.registered_claimed).toLowerCase() === 'true';
        let rawDate = user.last_bonus_date;
        let lastBonus = String(rawDate || "");
        const now = new Date();
        const today = new Date(now.getTime() + 3 * 3600 * 1000).toISOString().split("T")[0];

        let added = 0;
        let type = "";

        if (!rc) {
            rc = true;
            hc += 50;
            added = 50;
            type = "register";
        } else if (lastBonus !== today) {
            lastBonus = today;
            hc += 25;
            added = 25;
            type = "daily";
        } else {
            return { success: false, error: "Вы уже получили сегодняшний бонус" };
        }

        await supabase.from('users').update({ hue_coins: hc, registered_claimed: rc, last_bonus_date: today }).eq('username', payload.username);
        return { success: true, added, hueCoins: hc, type };
      }
      if (payload.action === 'buyItem') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Пользователь не найден" };
        const user = auth.user;
        let hueCoins = Number(user.hue_coins) || 0;
        let price = Number(payload.price) || 0;

        if (hueCoins >= price) {
            hueCoins -= price;
            await supabase.from('users').update({ hue_coins: hueCoins }).eq('username', payload.username);
            await supabase.from('purchases').insert({ username: payload.username, review_id: payload.reviewId, points: payload.points, type: payload.type, date: new Date().toISOString() });
            return { success: true, newBalance: hueCoins };
        } else {
            return { success: false, error: "Недостаточно HueCoins" };
        }
      }
      if (payload.action === 'getChartData') {
        let { data: purchases } = await supabase.from('purchases').select('*');
        return { success: true, purchases: (purchases || []).map(r => ({ reviewId: String(r.review_id), points: Number(r.points), type: String(r.type), date: String(r.date) })) };
      }
      return { success: false, error: "Неизвестное действие" };
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
