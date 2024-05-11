const speakeasy = require("speakeasy");

  var verifed=speakeasy.totp.verify({
    secret: '/(v1of.Ow5&7/y%{Zfm1#9(IM0N1dvCt',
    encoding: 'ascii',
    token:"170191"
  });
  console.log(verifed)