var DataTypes = require("sequelize").DataTypes;
var _amis = require("./amis");
var _choix = require("./choix");
var _mise = require("./mise");
var _pari = require("./pari");
var _parichoix = require("./parichoix");
var _paritag = require("./paritag");
var _tag = require("./tag");
var _users = require("./users");

function initModels(sequelize) {
  var amis = _amis(sequelize, DataTypes);
  var choix = _choix(sequelize, DataTypes);
  var mise = _mise(sequelize, DataTypes);
  var pari = _pari(sequelize, DataTypes);
  var parichoix = _parichoix(sequelize, DataTypes);
  var paritag = _paritag(sequelize, DataTypes);
  var tag = _tag(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  choix.belongsToMany(pari, { as: 'idpari_paris', through: parichoix, foreignKey: "idchoix", otherKey: "idpari" });
  pari.belongsToMany(choix, { as: 'idchoix_choixes', through: parichoix, foreignKey: "idpari", otherKey: "idchoix" });
  pari.belongsToMany(tag, { as: 'idtag_tags', through: paritag, foreignKey: "idpari", otherKey: "idtag" });
  tag.belongsToMany(pari, { as: 'idpari_pari_paritags', through: paritag, foreignKey: "idtag", otherKey: "idpari" });
  users.belongsToMany(users, { as: 'iduser_users', through: amis, foreignKey: "idamis", otherKey: "iduser" });
  users.belongsToMany(users, { as: 'idamis_users', through: amis, foreignKey: "iduser", otherKey: "idamis" });
  mise.belongsTo(choix, { as: "idchoix_choix", foreignKey: "idchoix"});
  choix.hasMany(mise, { as: "mises", foreignKey: "idchoix"});
  parichoix.belongsTo(choix, { as: "idchoix_choix", foreignKey: "idchoix"});
  choix.hasMany(parichoix, { as: "parichoixes", foreignKey: "idchoix"});
  mise.belongsTo(pari, { as: "idpari_pari", foreignKey: "idpari"});
  pari.hasMany(mise, { as: "mises", foreignKey: "idpari"});
  parichoix.belongsTo(pari, { as: "idpari_pari", foreignKey: "idpari"});
  pari.hasMany(parichoix, { as: "parichoixes", foreignKey: "idpari"});
  paritag.belongsTo(pari, { as: "idpari_pari", foreignKey: "idpari"});
  pari.hasMany(paritag, { as: "paritags", foreignKey: "idpari"});
  paritag.belongsTo(tag, { as: "idtag_tag", foreignKey: "idtag"});
  tag.hasMany(paritag, { as: "paritags", foreignKey: "idtag"});
  amis.belongsTo(users, { as: "idamis_user", foreignKey: "idamis"});
  users.hasMany(amis, { as: "amis", foreignKey: "idamis"});
  amis.belongsTo(users, { as: "iduser_user", foreignKey: "iduser"});
  users.hasMany(amis, { as: "iduser_amis", foreignKey: "iduser"});
  mise.belongsTo(users, { as: "iduser_user", foreignKey: "iduser"});
  users.hasMany(mise, { as: "mises", foreignKey: "iduser"});
  pari.belongsTo(users, { as: "iduser_user", foreignKey: "iduser"});
  users.hasMany(pari, { as: "paris", foreignKey: "iduser"});

  return {
    amis,
    choix,
    mise,
    pari,
    parichoix,
    paritag,
    tag,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
