import React,{useState,useEffect} from "react";
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Drawer,
  Box,
  FormControl,
  InputLabel,
  Input,
  Alert,
  Modal
} from "@mui/material";
import {MdOutlineAdd,MdSaveAlt,MdEdit,MdDelete} from 'react-icons/md';

const DataTable = () => {
    const [students,setStudents] = useState([]);
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [drawer,setDrawer] = useState(false);
    const [updateDrawer,setupdateDrawer] = useState(false);
    const [modal,setOpenModal] = useState(false);
    const [successMsg,setSuccessMsg] = useState("");
    const [stduentId,setStduentId] = useState();
    const baseUrl="http://localhost:3001";
    
    const getStudent =async()=>{
        await axios.get(`${baseUrl}/students`).then((response)=>{
            setStudents(response?.data)
        });
        }
    
    useEffect(()=>{
        getStudent();
    },[]);

    const addToggleDrawer = (value) => {
        setDrawer(value);
    };

    const updateToggleDrawer = (value,id) => {
        setupdateDrawer(value);
        setStduentId(id);
    };

    const deleteModal = (value,id) =>{
        setOpenModal(value);
        setStduentId(id);
    }

    const resetForm =()=>{
        setName("");
        setEmail("");
        setPhone("");
    }

    const addFormSubmit = async (e) =>{
        e.preventDefault();
        await axios.post(`${baseUrl}/students`,{
            name:name,
            email:email,
            phone:phone
        }).then((response)=>{
        if(response?.data?.status === 200){
            getStudent();
            setSuccessMsg(response?.data?.message);
            resetForm();
            setDrawer(false);
        }
        else{
            console.log("Something Wrong");
        }
    });
        
    }
    const updateFormSubmit = async (e) =>{
        e.preventDefault();
        await axios.put(`${baseUrl}/students/${stduentId}`,{
            name:name,
            email:email,
            phone:phone
        }).then((response)=>{
            if(response?.data?.status === 200){
            getStudent();
            setSuccessMsg(response?.data?.message);
            setupdateDrawer(false);
            resetForm();
        }
        else{
            console.log("Something Wrong");
        }
    });  
    }

    const deleteStudent = async () =>{
        await axios.delete(`${baseUrl}/students/${stduentId}`).then((response)=>{
            if(response?.data?.status === 200){
            getStudent();
            setSuccessMsg(response?.data?.message);
            setStduentId();
            setOpenModal(false);
        }
        else{
            console.log("Something Wrong");
        }
    }); 
        
    }

    const addStudent = () => (
    <Box role="presentation" sx={{ width:350,padding:"10px"}}>
        <h3>ADD STUDENT</h3>
        <Container>
           <form onSubmit={addFormSubmit}>
                <FormControl variant="standard" sx={{marginBottom:"15px",width:"100%"}}>
                    <InputLabel htmlFor="full_name">Full Name</InputLabel>
                    <Input id="full_name" value={name} onChange={(e)=>setName(e.target.value)} />
                </FormControl>
                <FormControl variant="standard" sx={{marginBottom:"15px",width:"100%"}}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </FormControl>
                <FormControl variant="standard" sx={{marginBottom:"15px",width:"100%"}}>
                    <InputLabel htmlFor="phone">Phone</InputLabel>
                    <Input id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                </FormControl>
                <Button type="submit" variant="contained">
                    <MdSaveAlt/> Save
                </Button>
            </form>
        </Container>
    </Box>
        
    )

    const updateStudent = () => 
    (
        <Box role="presentation" sx={{ width:350,padding:"10px"}}>
            <h3>UPDATE STUDENT</h3>
            <Container>
               <form onSubmit={updateFormSubmit}>
                    <FormControl variant="standard" sx={{marginBottom:"15px",width:"100%"}}>
                        <InputLabel htmlFor="full_name">Full Name{stduentId}</InputLabel>
                        <Input id="full_name" value={name} onChange={(e)=>setName(e.target.value)} />
                    </FormControl>
                    <FormControl variant="standard" sx={{marginBottom:"15px",width:"100%"}}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    </FormControl>
                    <FormControl variant="standard" sx={{marginBottom:"15px",width:"100%"}}>
                        <InputLabel htmlFor="phone">Phone</InputLabel>
                        <Input id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                    </FormControl>
                    <Button type="submit" variant="contained">
                        <MdSaveAlt/> Save
                    </Button>
                </form>
            </Container>
        </Box> 
    )

  return (
  <Container>
  {successMsg && (<Alert id="alert" severity="success" sx={{width:"100%",marginBottom:"10px"}}>{successMsg}</Alert>)}
  <TableContainer component={Paper} sx={{padding:"20px"}}>
    <Button variant="contained" size="small" sx={{float:"right"}}
    onClick={()=>{
        addToggleDrawer(true);
        resetForm();
    }}><MdOutlineAdd/>Add Student</Button>
    <Drawer
      anchor="right"
      open={drawer}
      onClose={()=>addToggleDrawer(false)}
    >
    {addStudent()}
    </Drawer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell >Name</TableCell>
            <TableCell >Email</TableCell>
            <TableCell >Phone</TableCell>
            <TableCell >Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
            students?.map((row)=>
                <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell >{row.name}</TableCell>
                    <TableCell >{row.email}</TableCell>
                    <TableCell >{row.phone}</TableCell>
                    <TableCell >
                    <Button onClick={()=>deleteModal(true,row.id)}><MdDelete size="20px" title="Delete" /></Button>
                    <Button onClick={()=>{
                        updateToggleDrawer(true,row.id);
                        setName(row?.name);
                        setEmail(row?.email);
                        setPhone(row?.phone);
                    }}><MdEdit size="20px" title="Update" /></Button>
                    </TableCell>
                </TableRow>
            )
            
        }
        </TableBody>
      </Table>
    </TableContainer>
    <Drawer
      anchor="right"
      open={updateDrawer}
      onClose={()=>updateToggleDrawer(false)}
    >
    {updateStudent()}
    </Drawer>
    <Modal open={modal} onClose={()=>deleteModal(true)}>
        <Box className="deleteModal">
            <h3>
                Are You Sure You Want Delete This?
            </h3>
            <Button variant="contained" color="success" sx={{marginRight:"10px"}} onClick={()=>deleteStudent(students.id)}>Yes</Button>
            <Button variant="contained" color="error" onClick={()=>deleteModal(false)}>No</Button>
        </Box>
   </Modal>
  </Container>
  )
};
export default DataTable;