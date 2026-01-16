# 📚 Smart Stationery Management System
Kani waa nidaam Full-stack ah oo loogu talagalay maamulka bakhaarka iyo iibka stationery-ga. Mashruucan wuxuu isku xiraa wejiga hore ee **React**, mishiinka dambe ee **ASP.NET Core**, iyo kaydka xogta ee **MongoDB**.

---

## 🏗 Qaab-dhismeedka System-ka (Architecture)
Nidaamku wuxuu u qaybsan yahay laba qaybood oo waaweyn oo ku wada jira hal meel:

* **Frontend**: Waxaa lagu dhisay React JS, Vite, iyo Tailwind CSS.
* **Backend**: Waxaa lagu dhisay ASP.NET Core Web API, isagoo isticmaalaya JWT Authentication.
* **Database**: MongoDB (NoSQL) oo loo isticmaalo kaydinta alaabta, dadka, iyo iibka.



---

## 🛠 Shuruudaha Bilowga (Prerequisites)
Kahor intaadan mashruuca kicin, hubi in kombiyuutarada ay ku rakiban yihiin:
* **Node.js** (V18+)
* **Node.js & npm:** Si uu u kiciyo Frontend-ka (React).
* **.NET 8.0 SDK**
* **MongoDB Community Server** & **Compass**
* **MongoDB Database Tools** (Si aad u isticmaasho `mongorestore`)

---

## 🚀 Tallaabooyinka lagu Kicinayo Mashruuca

### 1. Diyaarinta Database-ka (MongoDB)
Haddii laguu soo diray folder-ka `database_backup`, raac tallaabadan si aad xogta u soo celiso:
1. Fur Terminal-ka.
2. Qor amarkan:
   ```bash
   mongorestore --db StationeryDb ./database_backup/StationeryDb

   ---
markaad intaas soo sameyso waxaad sameyn waxaad kusoo kicin vs-code, markaas waxaad sameyn terminalka labo ayaad u kala jabin (split terminal) kadib folder-ka (frontend) gudaha u galaysa adigo isticmalya
(cd stationery-web) oo ah qeybta frontend.

qebta backend (cd stationeryApi)

markaa sidaas sameyso project qeybta frontend waxaad kusoo kicin oo ku ran gareyn (npm run dev) 
qeybta backend waxaad ku ran gareyn (dotnet run)

# **intaan kor kuso shegay oo qodobeysana hoos ku qoranyihin**

# 2. Tallaabooyinka uu qofku qaadayo (Setup Steps)
Marka uu qofkaas git clone ku sameeyo mashruucaaga, waa inuu raacaa tillaabooyinkan:

## A. Qaybta Backend-ka:
Waa inuu galaa folder-ka Backend-ka.

Restore: Waa inuu terminal-ka ku qoraa dotnet restore (inkastoo run ay iskiis u qabanayso).

Run: Waa inuu qoraa dotnet run.

Xusuusin: Waa inuu hubiyaa in appsettings.json uu ku qoran yahay Connection String-ka MongoDB-ga uu isagu isticmaalayo.

## B. Qaybta Frontend-ka:
Waa inuu galaa folder-ka Frontend-ka.

Install: Waa inuu qoraa npm install. Tani waa tallaabada ugu muhiimsan waayo node_modules kuma jiraan GitHub.

Run: Waa inuu qoraa npm run dev.
