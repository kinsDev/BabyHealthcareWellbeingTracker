var mongoose = require("mongoose")
var parentSchema = require("./schema")
var Parent = mongoose.model("Parent",parentSchema)
var childSchema = require("../child/schema")
var Child = mongoose.model("Child",childSchema)
var vaccineSchema = require("../vaccine/schema")
var Vaccine = mongoose.model("Vaccine",vaccineSchema)

addChild = (req,res) => {
    Parent.findById(req.user._id,(err,foundParent)=>{
        if(err){
            console.log(err)
            req.flash("error","UNEXPECTED ERROR OCCURED!!!")
            res.redirect("indexParent")
        }else{
            Vaccine.create({
                details : [
                { vaccineName : "BCG",whenToGive : "At birth or as early as possible within the first 15 days", dose : "1 dose",route : "Intradermal" ,site : "Left Upper Arm ",schedule : "Not Scheduled Yet"},
                { vaccineName : "Hepatitis B", whenToGive : "At birth or as early as possible within the first 15 days", dose : "1 dose",route : "Intramuscular" ,site : "Left thigh",schedule : "Not Scheduled Yet"  },
                { vaccineName : "OPV-0 ", whenToGive : "At birth or as early as possible within the first 15 days", dose : "1 dose",route : "Oral" ,site : "By mouth",schedule : "Not Scheduled Yet"  },
                { vaccineName : "OPV 1, 2 & 3 ", whenToGive : "At 6 weeks, 10 weeks & 14 weeks (OPV can be given till 5 years of age)", dose : "2 drops",route : "Oral" ,site : "Oral",schedule : "Not Scheduled Yet"  },
                { vaccineName : "Pentavalent 1, 2 & 3", whenToGive : "At 6 weeks, 10 weeks & 14 weeks (can be given till one year of age)", dose : "0.5 ml",route : "Intramuscular" ,site : "Antero-lateral side of mid-thigh",schedule : "Not Scheduled Yet"  },
                { vaccineName : "Pneumococcal Conjugate Vaccine (PCV)", whenToGive : "At 6 weeks, 10 weeks & 14 weeks", dose : "3 doses",route : "Intramascular" ,site : "Right thigh",schedule : "Not Scheduled Yet"  },
                { vaccineName : "Rotavirus#", whenToGive : "At 6 weeks, 10 weeks & 14 weeks (can be given till one year of age)", dose : "5 drops",route : "Oral" ,site : "Oral",schedule : "Not Scheduled Yet"  }, 
                { vaccineName : "Measles, Mumps, Rubella (MMR)", whenToGive : "At 9 months and 18 months", dose : "2 doses",route : "Subcutaneous " ,site : "Left upper Arm",schedule : "Not Scheduled Yet"  },   
            ]} , (err,createdVaccine) => {
                if(err){
                    console.log(err)
                    req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                    res.redirect("indexParent")
                }else{
                    Child.create({
                        fname : req.body.fname,
                        lname : req.body.lname,
                        image : "https://www.pngkey.com/png/full/230-2301779_best-classified-apps-default-user-profile.png",
                        dob : req.body.dob,
                        age : req.body.age,
                        gender : req.body.gender,
                        parent : foundParent,
                        vaccine : createdVaccine,
                        nextDate : "NOT SCHEDULED YET",
                        vaccineNumberWorkingOn : 0
                    }, (err,newChild) => {
                        if(err){
                            console.log(err)
                            req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                            res.redirect("indexParent")
                        }else{
                            var current = foundParent.children
                            if(current.length == 0 || current == undefined){
                                current = []
                            }
                            current.unshift(newChild)
                            foundParent.children = current
                            foundParent.save( (err,savedParent) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                                    res.redirect("indexParent")
                                }else{
                                    Parent.findByIdAndUpdate(req.user._id, savedParent ,(err,updatedParent) => {
                                        if(err){
                                            console.log(err)
                                            req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                                            res.redirect("indexParent")
                                        }else{
                                            req.flash("success","Child Added Successfully!!!")
                                            res.redirect("indexParent")
                                        }
                                    } )
                                }
                            } )
                        }
                    } )
                }
            })
        }
    })
}

module.exports = addChild