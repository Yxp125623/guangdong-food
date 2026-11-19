# 粤味 · 广东美食网

一个纯静态的广东美食主题网站存档，包含 6 个页面：首页、经典名菜、早茶人生、街头烟火、寻味地图、关于我们。

## 本地打开

直接双击 `index.html` 即可在任意浏览器中浏览，无需服务器。

## 部署到 GitHub Pages

1. 在 GitHub 上新建一个仓库（建议名称 `guangdong-food`）。
2. 在本目录执行：

   ```bash
   git remote add origin https://github.com/<你的用户名>/guangdong-food.git
   git push -u origin main
   ```

3. 进入仓库 **Settings → Pages**，Source 选择 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存。
4. 访问 `https://<你的用户名>.github.io/guangdong-food/` 即可。

> 仓库中已包含 `.nojekyll` 文件，可避免 GitHub Pages 的 Jekyll 处理影响静态资源。
