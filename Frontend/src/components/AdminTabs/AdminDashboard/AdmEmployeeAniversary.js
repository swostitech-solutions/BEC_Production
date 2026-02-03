import React from 'react'
import { Card, Navbar } from 'react-bootstrap';
const AdmEmployeeAniversary = () => {
  const employeeAniversary =[
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
    {id:1,name:'Name:Suri behera',email:'Email:suri@gmail.com',AniversaryDate:'Date:1/05/2022'},
 
  ];
  return (
    <div>
         <Navbar bg="primary" variant="dark" style={{ padding: '5px 10px' }}>
        <Navbar.Brand>Upcoming Employee Aniversary</Navbar.Brand>
      </Navbar>
      <div style={{height:'265px',overflowY:'auto'}}>
      {employeeAniversary.map((aniversary)=>(
        <Card key={aniversary.id} style={{width:'610px',margin:'10px',textAlign:'center',border:'1px solid blue',height:'60%'}}>
          <Card.Body>
            <Card.Title>{aniversary.name}</Card.Title>
            <Card.Title>{aniversary.email}</Card.Title>
            <Card.Title>{aniversary.AniversaryDate}</Card.Title>
          </Card.Body>

        </Card>
      ))}

      </div>
        </div>
  )
}

export default AdmEmployeeAniversary