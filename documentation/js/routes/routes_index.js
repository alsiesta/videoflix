var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","redirectTo":"/login","pathMatch":"full"},{"path":"login","component":"LoginComponent"},{"path":"register","component":"RegisterComponent"},{"path":"login/:uidb64/:token","component":"LoginComponent"},{"path":"datenschutz","component":"DatenschutzComponent"},{"path":"impressum","component":"ImpressumComponent"},{"path":"user_reset_password","component":"UserResetPasswordComponent","canActivate":["AuthGuard"]},{"path":"reset/:uidb64/:token","component":"UserconfirmnewpasswordComponent"},{"path":"home","component":"HomeComponent","canActivate":["AuthGuard"]},{"path":"video/:id","component":"VideodetailComponent","canActivate":["AuthGuard"]},{"path":"verify-email/:uid/:token","component":"EmailverificationComponent"},{"path":"**","redirectTo":"/login"}],"kind":"module"}]}
