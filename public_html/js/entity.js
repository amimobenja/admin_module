/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('entitiesFormApp', [])

        .controller('entitiesController', function ($scope, $http) {

            $scope.formDataTwo = {};
            $scope.myFunc = function () {
                $scope.showInvisble = false;
                $scope.myTxt = "";
                $http.get('http://localhost:8080/SMTP/SMS/hget_entity/' + $scope.eID).
                        then(function (response) {
                            if (response.data) {

                                $scope.showme = true;
                                $scope.smsEntity = response.data;

                                $scope.formDataTwo.permissions = response.data.entityPermissions;

                                angular.forEach($scope.smsEntity.entityPermissions, function (item) {
                                    console.log(item.permissionId, item.permission, item.caption);
                                });

                            } else {
                                $scope.showme = false;
                                $scope.myTxt = "Entity ID - " + $scope.eID + " Does not exist";
                            }
                        });

            };

//            $scope.myEditRoleFormFunc = function () {
//                $scope.myRoleIdTxt = "";
//                $http.get('http://localhost:8080/SMTP/SMS/get_role_permission/' + $scope.rID).
//                        then(function (response) {
//                            if (response.data) {
//                                $scope.showMyEditEntityPermissions = true;
//                                $scope.eRole = response.data;
//
//                                $http.get('http://localhost:8080/SMTP/SMS/hget_entities').
//                                        then(function (response) {
//                                            if (response.data) {
//                                                $scope.allEditEntities = response.data.entities;
//
//                                                $scope.editSelection = {permissions: {}};
//
//                                                $scope.showme = false;
////                                                alert($scope.allEditEntities.length);
//                                                for (var m = 0, n = $scope.eRole.permissions.length; m < n; m++) {
////                                                    alert($scope.eRole.permissions[m].permission);
//                                                    $scope.editSelection.permissions[[$scope.eRole.permissions[m].permissionId]] = true;
//                                                }
//                                                
////                                                for (var i = 0, j = $scope.allEditEntities.length; i < j; i++) {
////                                                    //                                    alert($scope.allEntities[i].entityName);
////                                                    for (var k = 0, l = $scope.allEditEntities[i].entityPermissions.length; k < l; k++) {
////                                                        //alert($scope.allEntities[i].entityPermissions[k].permission);
//////                                                        $scope.editSelection.permissions[[$scope.allEditEntities[i].entityPermissions[k].permissionId]] = true;
////                                                    }
////                                                }
//                                            } else {
//                                                alert("No Entities are Present at the moment");
//                                            }
//                                        });
//
//
//                            } else {
//                                $scope.showMyEditEntityPermissions = false;
//                                $scope.myRoleIdTxt = "Role ID - " + $scope.rID + " Does not exist";
//                            }
//                        });
//
//            };

            $scope.myEntitiesFunc = function () {
                $scope.myEntityTxt = "";
                $http.get('http://localhost:8080/SMTP/SMS/hget_entities').
                        then(function (response) {
                            if (response.data) {
                                $scope.showMyEntities = true;
                                $scope.entities = response.data;
                                $scope.showme = false;

                                angular.forEach($scope.entities.entities, function (item) {
                                    console.log(item.entityId, item.entityName, item.module);
                                })

                            } else {
                                $scope.showMyEntities = false;
                                $scope.showme = false;
                                $scope.myEntityTxt = "No Entities are Present at the moment";
                            }
                        });

            };


            $scope.myEntityPermissionsFunc = function () {
                $scope.myEntityTxt = "";
                $http.get('http://localhost:8080/SMTP/SMS/hget_entities').
                        then(function (response) {
                            if (response.data) {
                                $scope.showMyEntityPermissions = true;
                                $scope.allEntities = response.data.entities;
                                $scope.selection = {permissions: {}};

                                $scope.showme = false;
////                                alert($scope.allEntities.length);
//                                for (var i = 0, j = $scope.allEntities.length; i < j; i++) {
////                                    alert($scope.allEntities[i].entityName);
//                                    for (var k = 0, l = $scope.allEntities[i].entityPermissions.length; k < l; k++) {
////                                        alert($scope.allEntities[i].entityPermissions[k].permission);
//                                        $scope.selection.permissions[[$scope.allEntities[i].entityPermissions[k].permissionId]] = true;
//                                    }
//                                }
                            } else {
                                $scope.showMyEntityPermissions = false;
                                $scope.showme = false;
                                $scope.myEntityTxt = "No Entities are Present at the moment";
                            }
                        });
            };

            $scope.master = {};
            $scope.updateEntity = function (smsEntity) {
                $scope.master = angular.copy(smsEntity);

                //Call the Update service
                $http.put('http://localhost:8080/SMTP/SMS/hupdate_entity', JSON.stringify($scope.master)).then(function (response) {
                    if (response.data)
                        $scope.msg = "Put Data Method Executed Successfully!";
                    $scope.statusval = response.data.statusCode;
                    $scope.statustext = response.data.statusName;



                }, function (response) {
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.data.statusCode;
                    $scope.statustext = response.data.statusName;
                    $scope.headers = response.headers();
                });
            };

            $scope.showPerm = function () {
                $scope.showInvisble = true;

            };

            $scope.addUpdatePermission = function () {
                $scope.showInvisble = true;
                var newItemNo = $scope.formDataTwo.permissions.length + 1;
                $scope.formDataTwo.permissions.push({'permissionId': newItemNo});
            };

            $scope.removeUpdatePermission = function () {
                var lastItem = $scope.formDataTwo.permissions.length - 1;
                $scope.formDataTwo.permissions.splice(lastItem);
            };



            $scope.permissions = [];
            $scope.entity = {};
            $scope.addMaster = {};

            $scope.addPermission = function () {
                var newItemNo = $scope.permissions.length + 1;
                $scope.permissions.push({'permissionId': newItemNo});

            };

            $scope.removePermission = function () {
                var lastItem = $scope.permissions.length - 1;
                $scope.permissions.splice(lastItem);
            };

            $scope.addEntity = function (permissions) {
                var entityPermissions = {'entityName': $scope.entity.entityName, 'module': $scope.entity.module,
                    'entityPermissions': permissions};

                $scope.addMaster = angular.copy(entityPermissions);

                //Call the Post Service
                $http.post('http://localhost:8080/SMTP/SMS/hcreate_entity', JSON.stringify(entityPermissions)).then(function (response) {
                    if (response.data)
                        $scope.msg = "Post Data Submitted Successfully!";

                    $scope.statusval = response.data.statusCode;
                    $scope.statustext = response.data.statusName;

                }, function (response) {
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.data.statusCode;
                    $scope.statustext = response.data.statusName;
                    $scope.headers = response.headers();
                });

            };

//            $scope.createRole = function (grantedPermissions) {
//                var permissions = [];
//                angular.forEach(grantedPermissions, function (value, key) {
//                    if (value) {
//                        permissions.push({"permissionId": key});
//                    }
//                });
//
//                var rolePermissions = {'roleName': $scope.role.roleName, 'description': $scope.role.Description,
//                    'rolePermissionMapCollection': permissions};
//
//                $scope.roleMaster = angular.copy(rolePermissions);
//
////                Call the Post Service
//                $http.post('http://localhost:8080/SMTP/SMS/hcreate_role', JSON.stringify(rolePermissions)).then(function (response) {
//                    if (response.data)
//                        $scope.msg = "Post Data Submitted Successfully!";
//
//                    $scope.statusval = response.data.statusCode;
//                    $scope.statustext = response.data.statusName;
//
//                }, function (response) {
//                    $scope.msg = "Service not Exists";
//                    $scope.statusval = response.data.statusCode;
//                    $scope.statustext = response.data.statusName;
//                    $scope.headers = response.headers();
//                });
//
//            };
//            
//            
//            $scope.updateRole = function (upgradeGrantedPermissions, entityId) {
//                var permissions = [];
//                angular.forEach(upgradeGrantedPermissions, function (value, key) {
//                    if (value) {
//                        permissions.push({"permissionId": key});
//                    }
//                });
//
//                var rolePermissions = {'roleId': entityId, 'roleName': $scope.eRole.roleName, 
//                    'description': $scope.eRole.description,
//                    'rolePermissionMapCollection': permissions};
//
//                $scope.updateRoleMaster = angular.copy(rolePermissions);
//
////                Call the Post Service
//                $http.put('http://localhost:8080/SMTP/SMS/updateh_role', 
//                JSON.stringify(rolePermissions)).then(function (response) {
//                    if (response.data)
//                        $scope.msg = "Post Data Submitted Successfully!";
//
//                    $scope.statusval = response.data.statusCode;
//                    $scope.statustext = response.data.statusName;
//
//                }, function (response) {
//                    $scope.msg = "Service not Exists";
//                    $scope.statusval = response.data.statusCode;
//                    $scope.statustext = response.data.statusName;
//                    $scope.headers = response.headers();
//                });
//
//            };




        });

        