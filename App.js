import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Dimensions,TouchableOpacity, Switch, Alert } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -34.51260962788937;
const LONGITUDE = -58.4848275202878;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

export default class App extends React.Component {

constructor (props) {
  super(props)
  this.state = {
    initialRegion:{
      latitude: -34.51260962788937,
      longitude: -58.4848275202878,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },

    region: {
      latitude: -34.51260962788937,
      longitude: -58.4848275202878,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },

    reg: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    markers: [],

    toggle: false 
  }
}


onMapPress(e) {
  if (this.state.toggle == true){
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          des: id,
          key: id++,
          color: 'red',
  
        },
      ],
      
    });
    console.log(this.state.markers);
  }
  else{
    Alert.alert("El switch esta en off"); 
  }
}


currentLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    this.setState.initialRegion({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    }); 
    console.log("hola"); 
    console.log(pos.coords.latitude);
    console.log(pos.coords.longitude); 
    console.log(latitude);
    console.log(longitude); 
  
  })
}
componentDidMount(){
  this.currentLocation(); 
  
}

// el marker se pone en la ubicacion actual asi que eso esta bien, el tema es que no se zoomea automaticamente en donde estas
// ahora se hace zoom bien en donde estas porque puse mi region pero hay que corregirlo 

  render() {
    
    return (
      <View  style={styles.container}>
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          followUserLocation={true}
          zoomEnabled={true}
          initialRegion={this.state.initialRegion}
          onPress={e => this.onMapPress(e)}
          showsUserLocation ={true}>
        
        <Marker coordinate = {{latitude:this.state.initialRegion.latitude ,longitude:this.state.initialRegion.longitude }}
         pinColor = {"green"} // any color
         title={"Ubicacion actual"}
         description={"Esta es tu ubicacion actual"}/>

          <Switch 
          trackColor={{false: 'gray', true: 'teal'}}
          thumbColor="white"
          ios_backgroundColor="gray"
          onValueChange={(value) => this.setState({toggle: value})}
          value={this.state.toggle}
          paddingVertical = {10}
          alignItemsArr = {'center'}
          style={{ transform:[{ scaleX: .9}, { scaleY: .9 }] }, { marginTop: 180 }}
        />
       
        {this.state.markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.color}
              title={"Marker Nº" + marker.key}
              description={"holaaa"}
              
            />
          ))}
        
      </MapView>
      <View >
          <TouchableOpacity
            onPress={() => this.setState({ markers: [] })}
          >
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
 map: {
   position: 'absolute',
   top: 0,
   left: 0,
   right: 0,
   bottom: 0,
 },
 container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF',
},

});

