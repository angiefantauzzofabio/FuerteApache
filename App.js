import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Dimensions,TouchableOpacity, Switch, Alert, Image } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoder';
import * as geolib from 'geolib';
import { getDistance } from 'geolib';


const { width, height } = Dimensions.get('window');

const origin = {latitude: -34.51257677882224, longitude: -58.48521799748956};
const destination = {latitude: -34.54890367500137,  longitude: -58.454655947639345};
const GOOGLE_MAPS_APIKEY = ''; 
let id = 0;
const latDelta = 0.025; 
const lonDelta = 0.025; 

export default class App extends React.Component {

constructor (props) {
  super(props)
  this.state = {
    
    region: {
      latitude: '',
      longitude: '',
      latDelta,
      lonDelta
    },
  
    markers: [],

    toggle: false,

    //destino: {
    //  lat: -34.54890367500137,
    //  lon: -58.454655947639345
    //}

    residuos: [
      {
        id_residuo:"1",
        ubicacion:{
          lat: -34.50469966861708,
          lon: -58.48879929631948,
        },
        cantidad_bolsas:"4",
        //fecha_hora_emision:"",
      },
      {
        id_residuo:"2",
        ubicacion:{
          lat: -34.51865274201799,
          lon: -58.49203269928694,
        },
        cantidad_bolsas:"2",
        //fecha_hora_emision:"",
      },
      {
        id_residuo:"3",
        ubicacion:{
          lat:-34.52326678455729 ,
          lon: -58.48206594586372,
        },
        cantidad_bolsas:"2",
        //fecha_hora_emision:"",
      },
      {
        id_residuo:"4",
        ubicacion:{
          lat:  -34.534691604812274, 
          lon:-58.4719157369053,
         
        },
        cantidad_bolsas:"1",
       // fecha_hora_emision:"",
      },
      {
        id_residuo:"5",
        ubicacion:{
          lat: -34.50469966861708,
          lon: -58.48239921033383,
        },
        cantidad_bolsas: "3",
        //fecha_hora_emision:"",
      }
      
    ]
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

currentLocation() {
  navigator.geolocation.getCurrentPosition(pos => {

    let initialPosition = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025
    }
    this.setState({initialPosition}); 

  })
  
}
markersResiduos = () => {
  return this.state.residuos.map((residuos, item) => <Marker
    key={item} //sino me tira un error (warning each child in a list should have a unique key prop)
    coordinate={{ latitude: residuos.ubicacion.lat, longitude: residuos.ubicacion.lon }}
    description={'En ese punto hay ' + residuos.cantidad_bolsas + ' bolsas' + 'el id es: ' + residuos.id_residuo } 
  >
  </Marker >)
}

getAdress(){
  const axios = require('axios');
  var latitude = this.state.region.latitude; //me tira bien el valor de la latitud y longitud
  var longitude = this.state.region.longitude; 
  const params = {
  auth: '103257646821354730707x91346',
  locate: (latitude, longitude), 
  json: '1'
}
axios.get('https://geocode.xyz', {params})
  .then(response => {
    console.log(response.data);
    return response.data; 
  }).catch(error => {
    console.log(error);
  });

  
}
onChangeValue = region =>{
  this.setState({
    region
  })

}

componentDidMount(){
  this.currentLocation(); 
  console.log(this.coordinates());
  //console.log(this.distance (-34.512188257795394, -58.48517392701447,  -34.50469966861708, -58.48879929631948,))
  //console.log(this.pythagorasEquirectangular(-34.512188257795394, -58.48517392701447,  -34.50469966861708, -58.48879929631948)); 
  //this.coordinates();
  //this.c(); 
  //this.getAdress()
  //console.log(this.coordinates()); 
  //console.log(this.c()); 
  //console.log(this.distance(-34.51256135873614, -58.48501920231307, this.state.residuos[0].ubicacion.lat, this.state.residuos[0].ubicacion.lon))
  //console.log(this.state.residuos[1].ubicacion.lon)))
  //console.log (this.distance(-34.5128596,-58.4850423, -34.50469966861708, -58.48879929631948,)); 
}



deg2Rad = (deg) => { //para convertir de grados a radianes 
  return deg * Math.PI / 180;
}

pythagorasEquirectangular = (lat1, lon1, lat2, lon2) => {
  lat1 = this.deg2Rad(lat1);
  lat2 = this.deg2Rad(lat2);
  lon1 = this.deg2Rad(lon1);
  lon2 = this.deg2Rad(lon2);
  const R = 6371; //el radio 
  const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2); //aca remplazas los valores en la formula original 
  const y = (lat2 - lat1);
  const d = Math.sqrt(x * x + y * y) * R;
  return d;
}

distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

hola( ){
  navigator.geolocation.getCurrentPosition(
    (position) => {
          console.log(this.distance(position.coords.latitude, position.coords.longitude, this.state.residuos.ubicacion.lat, this.state.residuos.ubicacion.lon))
    }
    )
}

nearestMarker = () => {
 let mindif = 99999; //una distancia muy grande para que siempre sea mayor 
 let closest;
 navigator.geolocation.getCurrentPosition(
  (position) => {
     for (var i = 0; i < residuos.length; ++i) {
       console.log(position.coords.latitude);
       console.log(position.coords.longitude);
       console.log(this.state.residuos[index].ubicacion.lat);
       console.log(this.state.residuos[index].ubicacion.lon);
      const dif = this.distance(position.coords.latitude, position.coords.longitude, this.state.residuos[i].ubicacion.lat, this.state.residuos[i].ubicacion.lon);
      
      if (dif < mindif) {
        closest = index;
        mindif = dif;
     }
   
    }
    return residuos[closest]
  }
  )
}


coordinates(){ //deberia funcionar
  var distance = 0; 
  //var nearest = 0; 
  let mindif = 99999; //una distancia mas grande para que siempre sea mayor 
  let closest;
  var len = this.state.residuos.length; 
 for ( var j = 0; j < len; j= j +1){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(this.state.residuos[j].ubicacion.lat) 
          //console.log (position.coords.latitude, position.coords.longitude);
            distance =  this.pythagorasEquirectangular(position.coords.latitude, position.coords.longitude, this.state.residuos[j].ubicacion.lat, this.state.residuos[j].ubicacion.lon)
        }
        )
        if (distance < mindif) {
          closest = j;
          mindif = distance;
          
       }
       
  }
  
  return this.state.residuos[closest] 
  //devuelve la primera porque es la primera que da cero y mas chicxo que cero no hay
}


  render() {
    return (
      <View  style={styles.container}>
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          ref={map => this._map = map}
          initialRegion={this.state.initialPosition}
          //followUserLocation={true}
          onRegionChangeComplete ={this.onChangeValue}
          //zoomEnabled={true}
          onPress={e => this.onMapPress(e)}
          showsUserLocation ={true}>
          
          {this.markersResiduos()}

        <View style = {{top: '50%', left: '50%', marginLeft: -24, marginTop:-48, position:'absolute'}}> 
          <Image style={{height:48, width:48, justifyContent: 'center', alignSelf: 'center'}} source= {require('./assets/marker.png')}/>
        </View>
        
      <View style = {{align:"center"}}>
        <TouchableOpacity style= {styles.button}onPress={()=>{alert(JSON.stringify("latituud: " + this.state.region.latitude + " longitude: " + this.state.region.longitude)), console.log(this.getAdress())}
      }>
          <Text style={styles.text} >Confirmar ubicacion</Text>
        </TouchableOpacity>
      </View>
        
          <Switch 
          trackColor={{false: 'gray', true: 'blue'}}
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
marker: {
  height: 48,
  width: 48
},
button:{
  backgroundColor: '#98FF98',
  borderRadius: 12,
  padding: 10,
  alignItems: 'center',
  transform:[{ scaleX: .9}, { scaleY: .9}],
  
},
text :{
  alignSelf: 'center',
  fontSize: 16
}

});