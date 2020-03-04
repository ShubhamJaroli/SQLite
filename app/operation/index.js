import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { openDatabase } from "react-native-sqlite-storage";
const db = openDatabase({ name: "mydb.db" })
class Login extends Component {
    constructor() {
        super();
        this.state =
        {
            id: "",
            Password: ""
        }
    }
    login() {
        var that = this.props.navigation;
        var id = this.state.id;
        var p = this.state.Password;
        if (id == "" || p == "")
            alert("All parameters are required")
        else if (isNaN(parseInt(id)))
            alert("Id must be a numerical value")
        else {
            db.transaction(function (txn) {
                txn.executeSql("SELECT user_name FROM User WHERE user_id = ? AND user_password =?", [parseInt(id), p],
                    (txn,result) => {
                        if (result.rows.length == 0)
                            alert("Id or Password is InValid");
                        else {
                            var name = result.rows.item(0).user_name;
                            console.log(name);
                            try {
                                that.navigate("test", { Name: name, Id: id, Password: p });
                            }
                            catch (err) {
                                console.log(err)
                            }
                        }
                    })
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require("./images.jpeg")}
                    style={styles.img}
                ></Image>
                <Text style={styles.header}>Log In</Text>
                <TextInput style={styles.input} placeholder="Enter Id" keyboardAppearance="dark"
                    keyboardType="numeric" defaultValue={this.state.id} onChangeText={(i) => this.setState({ id: i })} />
                <TextInput style={styles.input} placeholder="Enter Password"
                    secureTextEntry={true} defaultValue={this.state.Password} onChangeText={(p) => this.setState({ Password: p })} />
                <TouchableOpacity style={styles.btn} onPress={this.login.bind(this)}>
                    <Text style={styles.btntext}>Log In</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class AfterLogin extends Component {
    constructor()
    {
        super();
        this.state=
        {
            Id:1,
            Name:"",
            Password:"",
        }
    }
    componentDidMount()
    {
        this.setState(
            {
                Id:this.props.navigation.state.params.Id,
                Name:this.props.navigation.state.params.Name,
                Password:this.props.navigation.state.params.Password
            }
        )
    }
    render() {
        
        return (
            <View>
             <Text>Name : {this.state.Name}</Text>
            </View>
        )
    }
}

const MainNavigator = createStackNavigator(
    {
        home: Login,
        test: AfterLogin
    }
)
const App = createAppContainer(MainNavigator);
export default App;

const styles = StyleSheet.create(
    {
        container:
        {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#2f3640'
        },
        header:
        {
            fontSize: 40,
            fontWeight: '500',
            fontStyle: 'italic',
            color: 'white',
            margin: 20
        },
        input:
        {
            borderColor: "#7f8c8d",
            borderWidth: 1,
            margin: 6,
            fontSize: 15,
            height: 45,
            width: 300,
            backgroundColor: 'white',
            textAlign: 'center',
            borderRadius: 5
        },
        img:
        {
            height: 200,
            width: 200,
            resizeMode: 'stretch'
        },
        btn:
        {
            backgroundColor: "#0097e6",
            height: 30,
            width: 200,
            alignItems: 'center',
            margin: 6
        },
        btntext:
        {
            color: 'white',
            fontSize: 20,
        }
    }
)