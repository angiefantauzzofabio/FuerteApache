import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Dimensions,TouchableOpacity, Switch, Alert } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -34.51260962788937;
const LONGITUDE = -58.4848275202878;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

const origin = {latitude: -34.51257677882224, longitude: -58.48521799748956};
const destination = {latitude: -34.54890367500137,  longitude: -58.454655947639345};
const GOOGLE_MAPS_APIKEY = '...'; 

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

    toggle: false,

    destino: {
      lat: -34.54890367500137,
      lon: -58.454655947639345
    }
  }
}


onMapPress(e) {
  if (this.state.toggle == true){
    
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: 'red',
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude
        },
      ],
    });
    console.log(this.state.markers);
  }
}

onPress(e) {
    this.setState({
      destino: [
        ...this.state.destino,
        {
          lat: e.latitude,
          lon: e.longitude
        },
      ],
    });
}

currentLocation() {
  var lat; 
  var lon; 
  navigator.geolocation.getCurrentPosition(pos => {

    lat = pos.coords.latitude; 
    lon = pos.coords.longitude; 

    this.setState.initialRegion({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    }); 
   
    console.log(pos.coords.latitude);
    console.log(pos.coords.longitude); 
    console.log(latitude);
    console.log(longitude); 
  
  })
return (lat, lon)
}

componentDidMount(){
  this.currentLocation(); 
}

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
         pinColor = {"green"} 
         title={"Ubicacion actual"}/>

        <Marker coordinate = {{latitude:this.state.destino.lat ,longitude:this.state.destino.lon }}
          pinColor = {"blue"} 
          title={"Destino"}/>

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
              description={JSON.stringify(marker.coordinate)}
              
            />
          ))}

          <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth = {3}
              strokeColor = {'black'}
          />
        
      </MapView>
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

