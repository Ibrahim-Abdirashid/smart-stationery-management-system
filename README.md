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
