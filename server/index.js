const express = require("express");
const con = require("./connections/connection");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT=3001;

const convertToObject =(value)=>{
    return{
        id:value.id,
        name:value.name,
        email:value.email,
        phone:value.phone
    }
}
// ##### START GET ALL STUDENT API #####
app.get("/students", (req,res)=>{
const selectAllStudent = "SELECT * from student ORDER BY id";
con.query(selectAllStudent, async(err,result)=>{
    if(!err){
        if(result.length === 0){
            res.send("NO data in Table");
        }else{
        res.send(result.map((eachValue)=>convertToObject(eachValue)));
        res.status(200);
        }
    }else{
        res.status(400);
        console.log(`Error ${err}`);
    }
})
});
// ##### END GET ALL STUDENT API #####

// ##### START GET SPECIFIC STUDENT API #####
app.get("/students/:studentId", (req,res)=>{
    const {studentId} = req.params;
    const selectAllStudent = `SELECT * from student WHERE id =${studentId}`;
    con.query(selectAllStudent, (err,result)=>{
        if(!err){
            res.send(result);
            res.status(200);
        }else{
            res.status(400);
            console.log(`Error ${err}`);
        }
    })
});
// ##### END GET SPECIFIC STUDENT API #####

// ##### START POST STUDENT API (ADD STUDENT)#####
app.post("/students", (req,res)=>{
const {name,email,phone} = req.body;
const addStudent ="INSERT INTO student (name,email,phone) VALUES (?,?,?)";
    con.query(addStudent,[name,email,phone], (err,result)=>{
        if(!err){
            res.send({
                message:"Student Successfully Added",
                status:200,
            });
        }else{
            res.status(400);
            console.log(`Error ${err}`);
        }
    });
});
// ##### END POST STUDENT API #####

// ##### START PUT STUDENT API (UPDATE STUDENT)#####
app.put("/students/:studentId", (req,res)=>{
    const {studentId} = req.params;
    const {name,email,phone} = req.body;
    const addStudent =`UPDATE student SET 
    name = '${name}',
    email ='${email}',
    phone = '${phone}' 
    WHERE id = ${studentId}`;
        con.query(addStudent, (err,result)=>{
            if(!err){
                res.send({
                    message:"Student Successfully Updated",
                    status:200,
                });
            }else{
                res.status(400);
                console.log(`Error ${err}`);
            }
        });
    });
// ##### END PUT STUDENT API #####

// ##### START DELETE STUDENT API (DELETE STUDENT)#####
app.delete("/students/:studentId", (req,res)=>{
    const {studentId} = req.params;
    const addStudent =`DELETE FROM student
    WHERE id = ${studentId}`;
        con.query(addStudent, (err,result)=>{
            if(!err){
                res.send({
                    message:"Student Successfully Deleted",
                    status:200,
                });
            }else{
                res.status(400);
                console.log(`Error ${err}`);
            }
        });
    });
// ##### END DELETE STUDENT API #####

app.listen(process.env.PORT || PORT ,()=>{
    console.log("Server Run at http://localhost:3001");
})