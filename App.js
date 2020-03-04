import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Button,
  TextInput
} from 'react-native';
import SignUp from "./app/database"
import Select from "./app/database"
import Login from "./app/operation"

class App extends Component
{
  constructor()
  {
    super()
    this.state={
      item:"",
    };
  }
  componentDidMount=async()=>
  {
    try
    {
      var i = await AsyncStorage.getItem("mykey");
      this.setState(
        {
          item:i,
          value:0
        }
      )
    }
    catch(err)
    {
      console.log("Error : "+err)
    }
  }
  storeData =async()=>
  {
    try
    {
      await AsyncStorage.setItem("mykey","Value")
      this.setState(
        {
          item: await AsyncStorage.getItem("mykey")
        }
      )
    }
    catch(err)
    {
        console.log("Error : "+err);
    }
  }

  deleteData = async()=>
  {
    try
    {
      await AsyncStorage.removeItem("mykey");
      this.setState(
        {
          item:await AsyncStorage.getItem("mykey")
        }
      )
      var j=[{"Name":"1","Id":"1","Password":"1"}];
      AsyncStorage.mergeItem("Employee",JSON.stringify(j))
      var Z = await AsyncStorage.getItem("Employee");
      console.log("Z : "+Z);
    }
    catch(err)
    {
      console.log("Error : "+err)
    }
  }
  addJSON =async()=>
  {
    var Shubham=
    {
      "Branch":"CSE",
      "ID":319
    }
    var Vikalp=
    {
      "Branch":"CSE",
      "ID":326
    }
    try
    {
      await AsyncStorage.setItem("Student",JSON.stringify(Shubham),async()=>
      {
        await AsyncStorage.mergeItem("Student",JSON.stringify(Vikalp),async()=>
        {
            await AsyncStorage.getItem("Student",(err,result)=>
            {
              if(err)
                console.log("Error : "+err);
              else
                console.log("Result : "+result);
            })
        })
      });
    }
    catch(err){}
  }
  render()
  {
    return(
      <View style={styles.container}>
          <Button title="store it" style={styles.button} onPress={this.storeData.bind(this)}/>
          <Button title="delete it"style={styles.button} onPress={this.deleteData.bind(this)}/>
          <Text style={fontSize=20}>{this.state.item}</Text>
          <Text onPress={()=> this.setState({value:parseInt(this.state.value)+1})}>Count : {this.state.value}</Text>
          <Button title="store json file" onPress={this.addJSON.bind(this)}/>
          <Button title="Go to Registered" onPress={()=>this.props.navigation.navigate("LogIn")}/>
          <Button title="Go to Log In" onPress={()=>this.props.navigation.navigate("SignIn")}/>
      </View>  
    );
   }
};

class Registered extends Component
{
  constructor()
  {
    super();
    this.state=
    {
      Name:"",
      Password:"",
      Id:"",
      Arr:[],
      text:""
    }
  }
  toClick()
  {
    var Name=this.state.Name;
    var Password=this.state.Password;
    var Id=this.state.Id;
    if(Name==""||Password==""||Id=="")
    {
      alert("All field is required")
      return;
    }
    this.storeData(Name,Password,Id);
  }
  storeData=async(N,P,I)=>
  {
    //console.log(N+" : "+P+" : "+I)
      try
      {
        var ar = await AsyncStorage.getItem("Employee");
       // console.log(ar+" : "+typeof(ar));
        var arr = JSON.parse(ar);
        //console.log("ARR: ",typeof(arr)+" : "+arr);
        //arr =Object.values(arr);
        //console.log(arr)
        var j ={"Name":N,"Password":P,"Id":I};
        //console.log("J : "+JSON.stringify(j));
        //arr.addJSON(JSON.stringify(j));
        //console.log("push to hua"+arr)
        await AsyncStorage.mergeItem("Employee",JSON.stringify(j));
        //console.log("setItem bhi hua")
        arr = await AsyncStorage.getItem("Employee");
        //console.log("getItem bhi hua")
        this.setState
        (
          {
            text:arr
          }
        )
      }
      catch(err)
      {
        console.log("Error: "+err)
      }
  }
  render()
  {
    return(
      <View>
        <TextInput placeholder="Enter Name" defaultValue={this.state.Name} 
          onChangeText={(text)=>this.setState({Name:text})}
        />
        <TextInput placeholder="Enter Password" defaultValue={this.state.Password} 
          onChangeText={(text)=>this.setState({Password:text})} secureTextEntry={true}
        />
         <TextInput placeholder="Enter Id" defaultValue={this.state.Id} 
          onChangeText={(text)=>this.setState({Id:text})} keyboardType='numeric'
        />
        <Button title="Sign up" onPress={this.toClick.bind(this)}/>
        <Text>{this.state.text}</Text>
      </View>
    )
  }
}

const MainNavigator= createStackNavigator(
  {
    home:App,
    LogIn:SignUp,
    show:Select,
    SignIn:Login,
  }
)

const X =createAppContainer(MainNavigator);
const styles = StyleSheet.create({
  container:
  {
    flex:1,
    justifyContent:'center',
    alignContent:'center'
  },
  button:
  {
    padding:3,
    margin:3
  }
});

export default X;
