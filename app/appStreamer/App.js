import React, { Component } from 'react';
import { Text, View, Image, Button, Animated,StyleSheet } from 'react-native';
import hyExt from 'hyliveext-rn-sdk';

export default class appStreamer extends Component {
    constructor(initialProps) {
        super();
        this.state={
            isEmpty:true,
            show:false,
            introType:'',
            intro_data:[],
            intro_msg:[
                {
                    msg:"欢迎使用弹幕tools",
                    id:0
                },
                {
                    msg:"您可以通过创建模板，",
                    id:1
                },
                {
                    msg:"添加您想监听的弹幕关键字，",
                    id:2
                },
                {
                    msg:"填入您想回应的信息，",
                    id:3
                },
                {
                    msg:"弹幕tools就可以帮助您在直播界面回应弹幕哦",
                    id:4
                },
                {
                    msg:"快来创建第一个模板来体验吧！",
                    id:5
                }
            ],
            fadeAnim:[
                {
                    value:new Animated.Value(0),
                    delay:0
                },
                {
                    value:new Animated.Value(0),
                    delay:1000
                },
                {
                    value:new Animated.Value(0),
                    delay:2000
                },
                {
                    value:new Animated.Value(0),
                    delay:3000
                },
                {
                    value:new Animated.Value(0),
                    delay:4000
                },
                {
                    value:new Animated.Value(0),
                    delay:5000
                },
            ],
            initial_color:new Animated.Value(0),
        }
        this.addAnim=this.addAnim.bind(this)
        
    }

    componentWillMount() {
        hyExt.storage.getKeys().then(keys => {
            hyExt.logger.info('获取成功', keys)
            if(keys.length===0){
                this.setState((state)=>{
                    return {
                        show:true,
                        intro_data:state.intro_msg,
                        introType:'intro'
                    }
                })
            }else{
                this.setState(()=>{
                    return {
                        show:true,
                        isEmpty:false,
                        introType:'templates'
                    }
                })
            }
        }).catch(err => {
            hyExt.logger.warn('获取失败', err)
        })
    }

    componentDidMount() {
        
    }

    addAnim(idx) {
        Animated.timing(
            this.state.fadeAnim[idx].value,
            {
                toValue:1,
                duration:1000,
                delay:this.state.fadeAnim[idx].delay
            }
        ).start()
    }

    changeBackgroundColor(){
        Animated.timing(
            this.state.initial_color,
            {
                toValue:360,
                duration:1000,
            }
        ).start(()=>this.changeBackgroundColor())
    }

    _goToAdd(){
        console.log('创建')
    }

    _goToTemplates(){
        console.log('查看')
    }

    render() {
        let { fadeAnim, intro_msg } = this.state
        // const interpolatedColorAnimation = this.initial_color.interpolate({
        //     inputRange: [0, 360],
        //   outputRange: ['rgba(255,255,255, 1)', 'rgba(51,156,177, 1)']
        // })
        console.log(fadeAnim[0].value)
        return (
            <View style={[styles.wrapperStyle]}>
                {
                    this.state.isEmpty?(
                        <View style={[styles.intro]}>
                        {
                            
                            intro_msg.map((item,idx)=>{
                                this.addAnim(item.id)
                                return(
                                    <Animated.Text key={item.id} style={{opacity:fadeAnim[item.id].value}}>{item.msg}</Animated.Text>
                                )
                            })
                        }
                        </View>
                    ):(
                        <Button title="查看模板列表" onPress={this._goToTemplates} />
                    )
                }
                <Button title="创建模板" onPress={this._goToAdd} />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    wrapperStyle:{
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
    },
    intro:{
        marginBottom:10,
        justifyContent: "center", 
        alignItems: "center",
    }
})