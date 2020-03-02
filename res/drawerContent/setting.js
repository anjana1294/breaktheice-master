import React, { Component } from 'react';
import {StatusBar,View,Text,Platform,TouchableOpacity,StyleSheet} from 'react-native';
import {Header,Content,Container,Left,Icon,Body,Title,Right} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export default class Setting extends Component{
    constructor(props){
        super(props);
    }

    goToBlockList = () =>{
        this.props.navigation.navigate('blockList');
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
                        <Icon name='menu' onPress={()=>this.props.navigation.navigate('DrawerOpen')} style={{
                            color:'white'
                        }} />
                    </Left>
                <Body style={{
                    flex:1,
                    alignItems:'center'
                }}>
                        <Title style={{
                            color:'white',
                        }}>Settings</Title>
                </Body>
                <Right style={{
                    flex:1
                }}/>
                </Header>
                <Content contentContainerStyle={{
                    flex:1,
                }}>
                    <TouchableOpacity style={styles.blocklistStyle} onPress={this.goToBlockList}>
                        <Text style={{
                            fontSize:20,
                            color:'black'
                        }}>Blocklist</Text>
                        <MaterialIcons name='block' style={{
                            fontSize:20,
                            color:'red'
                        }}/>
                    </TouchableOpacity>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    blocklistStyle:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:30,
        justifyContent:'space-between',
        paddingVertical: 10,
    }
})