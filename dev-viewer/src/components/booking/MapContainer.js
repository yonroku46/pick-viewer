import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react'
import Geocode from "react-geocode";
 
export class MapContainer extends Component {
    state = {
        shop: this.props.shop,
        address: '',
        zoom: 15,
        mapPosition:{
            lat: 0,
            lng: 0,
        },
        markerPosition: {
            lat: 0,
            lng: 0,
        }
    }

    componentDidMount() {
        if (this.state.shop.location_lat === 0 && this.state.shop.location_lng === 0 && this.props.permission === 3) {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.setState({
                        mapPosition:{
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        markerPosition:{
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        } else {
            this.setState({
                mapPosition:{
                    lat: this.state.shop.location_lat,
                    lng: this.state.shop.location_lng,
                },
                markerPosition:{
                    lat: this.state.shop.location_lat,
                    lng: this.state.shop.location_lng
                }
            })
        }
    }

    convertNumber(str) {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }

    convertAddress(addressArray) {
        var res = ''
        addressArray.reverse();
        for(var i = 2; i < addressArray.length; i++) {
            res += this.convertNumber(addressArray[i].long_name) + ' ';
        }
        return res.slice(0, -1);
    }

    onMarkerDragEnd = (coord) => {
        const { latLng } = coord;
        const newLat = latLng.lat();
        const newLng = latLng.lng();

        Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
        Geocode.setLanguage('ko');
        Geocode.fromLatLng(newLat, newLng)
            .then(response => {
                const addressArray = response.results[0].address_components;
                // const address = response.results[0].formatted_address;
                const address = this.convertAddress(addressArray);
                console.log(addressArray)
                console.log(address)
                
                this.setState({
                    address: address ? address : "",
                    markerPosition:{
                        lat: newLat,
                        lng: newLng
                    },
                    mapPosition:{
                        lat: newLat,
                        lng: newLng
                    }
                });
                this.props.setShop(
                    { ...this.props.shop, location_lat: newLat, location_lng: newLng }
                );
                this.props.setLocationSearch(address);
            }) 
    }

    render() {
        return (
            <div className='map-container'>
            {(this.state.mapPosition.lat && this.state.mapPosition.lng) &&
            <Map
                className='google-map'
                google={this.props.google}
                zoom={this.state.zoom}
                mapTypeControl={false}
                streetViewControl={false}
                keyboardShortcuts={false}
                initialCenter={{lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng}}
            >
            <Marker
                position={{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng}}
                draggable={this.props.editMode}
                onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
            />
            </Map>
            }
            </div>
        );
  }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    language: 'ko'
})(MapContainer)