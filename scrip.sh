npx sequelize-cli model:generate --name User --attributes fullName:string,username:string,email:string,password:string
npx sequelize-cli model:generate --name Thumbnail --attributes id_foto:string,url:string,alt:string
npx sequelize-cli model:generate --name Category --attributes slug:string,name:string
npx sequelize-cli model:generate --name Blog --attributes title:string,slug:string,description:string,content:text,thumbnail:string,category:string,author:string
