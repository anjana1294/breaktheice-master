import React,{Component} from 'react';
import {ActivityIndicator,Modal,StatusBar,View,Text,FlatList} from 'react-native';
import{Header,Left,Icon,Body,Content,Container,Title, Right} from 'native-base';
import Axios from 'axios';
export default class Faq extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[
            ],
            activity:false
        }
    }
    componentDidMount(){
        this.setState({
            activity:true
        })
        Axios.get('http://profile.appsimity.com/breakice/webservices.php?function=faqs')
        .then((res)=>{
            if(res.data.status){
                this.setState({
                    data:res.data.data,
                    activity:false
                })
            }
        })
        .catch((res)=>{
            this.setState({
                activity:false
            })
        })
    }
    render(){
        return(
            <Container>
                <Header  style={{
                    backgroundColor:'rgb(255,13,119)'
                }}>
                 <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                    <Left style={{
                        flex:1
                    }}>
                        <Icon name='menu' onPress={()=>this.props.navigation.navigate('DrawerOpen')}
                        style={{
                            color:'white'
                        }} />
                    </Left>
                    <Body style={{
                        flex:1,
                        alignItems:'center'
                    }}>
                        <Title style={{
                            color:"white",
                        }}>
                            FAQ's
                        </Title>
                    </Body>
                    <Right style={{
                        flex:1
                    }}/>

                </Header>
                    <Content contentContainerStyle={{
                        flex:1,
                    }}>
                        <FlatList
                        style={{
                            flex:1
                        }}
                        data={this.state.data}
                        renderItem = {
                            ({item})=>
                                <View style={{
                                    marginHorizontal:'5%',
                                    marginVertical:15,
                                    flex:1,
                                    justifyContent:'space-around',
                                    flexDirection:'column',
                               
                                }}>

                                    <View style={{
                                        flex:1,
                                        flexDirection:'row',
                                        alignContent:'center',
                                        justifyContent:'space-between',
                                        marginBottom:5,
                                        alignItems:'center',
                                      
                                    }} >
                                        <View style={{
                                            backgroundColor:'rgb(220,220,220)',
                                            borderRadius:25,
                                            height:50,
                                            width:50,
                                            alignItems:'center',
                                            flex:1,
                                        }}>
                                            <Text style={{
                                                fontSize:30,
                                                color:'rgb(255,13,119)'
                                            }}>Q</Text>
                                        </View>
                                        <View style={{
                                            flex:10
                                        }}>
                                            <Text style={{
                                                color:'black',
                                                fontSize:15
                                            }}>{item.question}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection:'row',
                                        alignItems:'center',
                                        justifyContent:'space-between',
                                        flex:1,
                                    }}>
                                        <View style={{
                                            backgroundColor:'rgb(255,13,119)',
                                            borderRadius:20,
                                            flexDirection:'row',
                                            marginHorizontal:20,
                                            flex:20
                                        }}>
                                            <Text style={{
                                                color:'white',
                                                fontSize:15,
                                                padding:10
                                            }}>{item.answer}</Text>
                                        </View>
                                        <Text style={{
                                            fontSize:40,
                                            flex:2,
                                            color:'rgb(255,13,119)'
                                        }}>A</Text>
                                    </View>
                                </View>
                            
                        }
                        />
                    </Content>
                    {this.state.activity && (
                        <Modal transparent onRequestClose={()=>{}}>
                            <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                                <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                            </View>
                        </Modal>
                    )}
            </Container>
        );
    }
}