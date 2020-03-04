import {openDatabase} from "react-native-sqlite-storage";
import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React, { Component } from 'react';
import{Table,Row,Rows} from 'react-native-table-component'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
   
  } from 'react-native'
const db =openDatabase({name:"mydb.db"})

class SignUP extends Component
{
    constructor()
    {
        super();
        db.transaction(function(txn)
        {
            txn.executeSql("CREATE TABLE IF NOT EXISTS User (user_id int,user_name VARCHAR(20),user_password VARCHAR(20),PRIMARY KEY (user_id))",[],(txn,res)=>
            {
                console.log(result);
            },(err)=>
            {
                console.log("Error"+err);
            });
        });
        this.state=
        {
            Name:"",
            Password:"",
            Id:""
        }
    }
    toClick()
    {
        var Name=this.state.Name;
        var Password=this.state.Password;
        var Id =this.state.Id;
        if(Name==""||Password==""||Id=="")
        {
        alert("All field is required")
        return;
        }
        this.storeData(Name,Password,parseInt(Id));
    }
    storeData(N,P,I)
    { 
        db.transaction(function(txn)
        {

            txn.executeSql("INSERT INTO User (user_name,user_password,user_id) VALUES(?,?,?)",[N,P,I],(txn,result)=>
            {
                console.log(result.rowsAffected)
                if(result.rowsAffected==0)
                    alert("There are some error occured");
                else
                {
                    alert("Result : "+result);
                }
            })
        },
        (err)=>
        {
            console.log("Error : "+err)
        }
        )
    }
    show()
    {
        var that =this.props.navigation;
        db.transaction(function(txn)
        {
            txn.executeSql("Select * from User",[],(txn,result)=>
            {
                console.log(result.rows);
                console.log("Result : "+result);
                var l=result.rows.length;
                var temp=[];
                for(let i=0;i<l;i++)
                {
                    temp.push(result.rows.item(i));
                }
                //debugger;
                console.log(temp)
                try
                {
                    that.navigate("show",{datas:temp});
                    console.log("Temp : "+temp);
                }
                catch(err)
                {
                    console.log("Error : "+err);
                }
               
            })
        },(err)=>
        {
            console.log("Error : "+err);
        })
    }
    delete()
    {
        var Name=this.state.Name;
        var Password=this.state.Password;
        if(Name==""||Password=="")
        {
        alert("All field is required")
        return;
        }
        db.transaction(function(txn)
        {
            txn.executeSql("DELETE FROM User WHERE user_name = ? AND user_password = ?",[Name,Password],(txn,result)=>
            {
                if(result.rowsAffected==0)
                    alert("UserName or Password is InValid");
                else
                    alert("Deletion Succesfully");
            },(err)=>
            {
                console.log("Error : "+err);
            })
        })
    }

    update()
    {
        var Name=this.state.Name;
        var Password=this.state.Password;
        if(Name==""||Password=="")
        {
            alert("All field is required")
            return;
        }
        db.transaction(function(txn)
        {
            txn.executeSql("UPDATE User SET user_name='Shubham Jaroli' Where user_name =? AND user_password = ?",[Name,Password],
            (txn,result)=>
            {
                if(result.rowsAffected==0)
                    alert("UserName or Password is InValid");
                else
                    alert("Updation Succesfully");
            })
        },(err)=>
        {
            console.log("Error : "+err);
        })
    }
   render()
   {
       return(
       <View style ={styles.container}>
           <TextInput placeholder="Enter Name" defaultValue={this.state.Name} 
                onChangeText={(text)=>this.setState({Name:text})}                
                style={styles.input}
            />
            <TextInput placeholder="Enter Password" defaultValue={this.state.Password} 
                onChangeText={(text)=>this.setState({Password:text})} secureTextEntry={true}
                style={styles.input}
            />
            <TextInput placeholder="Enter Id" defaultValue={this.state.Id} 
                onChangeText={(text)=>this.setState({Id:text})} keyboardType='numeric'
                style={styles.input}
            />
            <Button title="Sign up" onPress={this.toClick.bind(this)}/>
            <Text></Text>
            <Button title ="Show " onPress ={this.show.bind(this)}/>
            <Text></Text>
            <Button title="Delete" onPress={this.delete.bind(this)}/>
            <Text></Text>
            <Button title="Update" onPress={this.update.bind(this)}/>
        </View>)
       ;
   }
}

class Select extends Component
{
    render()
    {
        var Temp = this.props.navigation.state.params.datas;
        var rowdata =['ID','USERNAME','PASSWORD'];
        var rowsdata=[];
        var l=Temp.length;
        for(let i=0;i<l;i++)
        {
            var a=[];
            a.push(Temp[i].user_id);
            a.push(Temp[i].user_name);
            a.push(Temp[i].user_password);
            rowsdata.push(a);
        }
        return(
            <ScrollView>
                <Text>All Data</Text>
                <Table style={styles.table}>
                    <Row style={styles.row} data={rowdata}></Row>
                    <Rows style={styles.rows} data={rowsdata}></Rows>
                </Table>
            </ScrollView>
        );
    }
}
const MainNavigator=createStackNavigator(
    {
        home:SignUP,
        show:Select
    }
)

const styles=StyleSheet.create(
    {
        table:
        {
            borderStyle:'solid',
            borderColor:'black',
            borderWidth:1,
            borderBottomColor:'black',
            borderBottomWidth:1,
            padding:2,
            margin:2,
            borderStartColor:'black',
            borderStartWidth:1
        },
        row:
        {
            fontSize:20,
            fontWeight:'bold',
            fontStyle:'normal',
            backgroundColor:'#a4b0be'
        },
        rows:
        {
            fontSize:18,
            fontStyle:'italic',
            backgroundColor:'#dfe4ea'

        },
        container:
        {
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#2f3640'
        },
        header:
        {
            fontSize:40,
            fontWeight:'500',
            fontStyle:'italic',
            color:'white',
            margin:20
        },
        input:
        {
            borderColor:"#7f8c8d",
            borderWidth:1,
            margin:6,
            fontSize:15,
            height:45,
            width:300,
            backgroundColor:'white',
            textAlign:'center',
            borderRadius:5
        },
    }
)

export default createAppContainer(MainNavigator)