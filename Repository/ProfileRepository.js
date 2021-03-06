
var Models=require('./Models.js');
var ProcedureResponse=require('./ProcedureResponse');

var Repository={
    Register:function(Profile,callback){
        var rawSql = 'call CreateUser(?,?,?,?,?,?,?,?,?,?,?,?,?,@Result);select @Result;';
        Models.bookshelf.knex.raw(rawSql,[
            Profile._Id.toHexString() || '',
            Profile.User.Email || null,
            Profile.User.Mobile || null,

            Profile.User.RegistrationIp || '',
            Profile.User.EmailVerification || '',
            Profile.User.MobileVerification || '',
            Profile.User.Password || '',
            Profile.User.Salt || '',

            Profile.FirstName || '',
            Profile.LastName || '',
            Profile.ProfileName || '',
            Profile.ProfilePic || '',
            Profile.AccountType || null
        ])
        .then(function (ProfileDbModel) {
            var result=ProcedureResponse.returnData(ProfileDbModel);

            if(result==1)
                callback({error: false, data:Profile._Id.toHexString()});
            else
                callback({error: true, data:{message: 'Unable to create user.'}});
        })
        .catch(function (err) {
            console.log(err);
            callback({error: true, data: {message: 'Internal server error.'}});
        }); 
        
    },
    add:function(Profile,callback){
        Models.Profile
            .forge({
                _Id:Profile._id,
                Email:Profile.Email,
                FirstName: Profile.FirstName,
                LastName: Profile.LastName,
                ProfileName: Profile.ProfileName,
                ProfilePic: Profile.ProfilePic,
                Live: Profile.Live || true,
                IsActive:Profile.IsActive || true,
                Status:0
            })
            .save()
            .then(function (ProfileDbModel) {
                callback({error: false, data:  Profile._id});
            })
            .catch(function (err) {
                callback({error: true, data: {message: 'Add failed for profile.'}});
            }); 
    },
    update:function(Profile,callback){
        Models.Profile
            .forge({_id: Profile._id})
            .fetch()
            .then(function(model) {
                model.set({
                    FirstName: Profile.FirstName || model.get('FirstName'),
                    LastName: Profile.LastName || model.get('LastName'),
                    ProfileName: Profile.ProfileName || model.get('ProfileName'),
                    ProfilePic: Profile.ProfilePic || model.get('ProfilePic'),
                    Location: Profile.Location || model.get('Location'),
                    Live: Profile.Live !=null ? Profile.Live : model.get('Live'),
                    IsActive:Profile.IsActive!=null ? Profile.IsActive : model.get('IsActive'),
                    Status:Profile.Status || model.get('Status')
                })
                .save()
                .then(function () {
                    callback({error: false, data: model.toJSON()});
                })
                .catch(function (err) {
                    callback({error: true, data: {message: 'Update failed for profile.'}});
                });
            });
            
    },
    delete:function(id,callback){
        Models.Profile
            .forge({_id: id})
            .fetch({require: true})
            .then(function (Profile) {
                Models.Profile.destroy()
                .then(function () {
                    callback({error: false, data: {message: 'Profile successfully deleted'}});
                })
                .catch(function (err) {
                callback({error: true, data: {message: 'Delete failed for profile.'}});
                });
            })
            .catch(function (err) {
                callback({error: true, data: {message: 'Delete failed for profile.'}});
            });
    },
    getAll:function(callback){
        Models.Profiles
            .forge()
            .fetch()
            .then(function (Profiles) {
                callback({error: false, data: Profiles.toJSON()});
            })
            .catch(function (err) {
                callback({error: true, data: {message: 'Unable to get profiles.'}});
            });
    },
    getById:function(id,callback){
        Models.Profile
            .where({_id: id})
            .fetch({ withRelated: []})
            .then(function (Profile) {
                if (!Profile) {
                    callback({error: true, data: {message: 'Profile not found.'}});
                }
                else {
                    callback({error: false, data: Profile.toJSON()});
                }
            })
            .catch(function (err) {
                console.log(err);
                callback({error: true, data: {message: 'Unable to get profile.'}});
            });
    },
    getByName:function(name,callback){
       Models.Profile
            .forge({FirstName: name})
            .fetch()
            .then(function (Profile) {
                if (!Profile) {
                    callback({error: true, data: {}});
                }
                else {
                    callback({error: false, data: Profile.toJSON()});
                }
            })
            .catch(function (err) {
                callback({error: true, data: {message: 'Unable to get profile.'}});
            });
    },
    getByEmail:function(email,callback){
       Models.Profile
            .forge({Email: email})
            .fetch()
            .then(function (Profile) {
                if (!Profile) {
                    callback({error: true, data: {}});
                }
                else {
                    callback({error: false, data: Profile.toJSON()});
                }
            })
            .catch(function (err) {
                callback({error: true, data: {message: 'Unable to get profile.'}});
            });
    },
    searchProfile:function(_ids,callback){
       Models.Profiles
            .forge()
            .fetch()
            .then(function (Profile) {
                if (!Profile) {
                    callback({error: true, data: {}});
                }
                else {
                    callback({error: false, data: Profile.toJSON()});
                }
            })
            .catch(function (err) {
                callback({error: true, data: {message: 'Unable to get profile.'}});
            });
    }
};
module.exports=Repository;