# RecipeCube前端
![image](https://github.com/Andy880828/RecipeCube/blob/9e440d8549b6f0efe934d26e2349b45edb97c516/RecipeCube.png)  
食譜魔方是一個用來管理家中食物的WEB APP，透過量化方式紀錄食材數量，並利用"根據所剩食材客製化產生食譜"的功能，幫助我們減少生活中的食材浪費。  
技術上前端利用Vue3框架(Composition API)建構網站本體，Fetch串接後端Restful API，透過此與SQL server溝通。

## 試用
目前我用Google Cloud部署在雲端VM，網址為https://chlinandys.com，圖片有壓縮過所以比較糊還請見諒。

## 建置
本專案使用Vite，可利用以下指令建置與執行。  
(但如要完整執行，還需同時執行後端程式，或串接我雲端的API)
### 安裝必要套件
```sh
npm install
```

### 開發環境

```sh
npm run dev
```

### 部署環境

```sh
npm run build
```
