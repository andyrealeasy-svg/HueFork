const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const oldHandleUpload = `    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 3 * 1024 * 1024) {
        window.appAlert("Файл слишком большой! Максимум 3 Мб.");
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${user.username}_\${type}_\${Math.random().toString(36).substring(2)}.\${fileExt}\`;
      
      const btn = document.getElementById(\`upload-\${type}-btn\`);
      const originalText = btn.innerHTML;
      btn.innerHTML = "Загрузка...";
      
      const { data, error } = await supabase.storage.from('profiles').upload(fileName, file);
      
      if (error) {
        window.appAlert("Ошибка загрузки: " + error.message);
        btn.innerHTML = originalText;
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      
      const pData = JSON.parse(localStorage.getItem("personalProfile") || "{}");
      if (type === 'avatar') pData.avatarUrl = publicUrl;
      if (type === 'banner') pData.bannerUrl = publicUrl;
      localStorage.setItem("personalProfile", JSON.stringify(pData));
      
      syncUserLocalData().then(() => renderPersonalProfile());
    };`;

const newHandleUpload = `    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 3 * 1024 * 1024) {
        window.appAlert("Файл слишком большой! Максимум 3 Мб.");
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${user.username}_\${type}_\${Math.random().toString(36).substring(2)}.\${fileExt}\`;
      
      const btn = document.getElementById(\`upload-\${type}-btn\`);
      let originalText = "";
      if (btn) {
         originalText = btn.innerHTML;
         btn.innerHTML = "Загрузка...";
      }
      
      const { data, error } = await supabase.storage.from('profiles').upload(fileName, file);
      
      if (error) {
        window.appAlert("Ошибка загрузки: " + error.message);
        if (btn) btn.innerHTML = originalText;
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      
      const pData = JSON.parse(localStorage.getItem("personalProfile") || "{}");
      if (type === 'avatar') pData.avatarUrl = publicUrl;
      if (type === 'banner') pData.bannerUrl = publicUrl;
      localStorage.setItem("personalProfile", JSON.stringify(pData));
      
      syncUserLocalData().then(() => renderPersonalProfile());
    };`;

code = code.replace(oldHandleUpload, newHandleUpload);
fs.writeFileSync('profile.js', code);
