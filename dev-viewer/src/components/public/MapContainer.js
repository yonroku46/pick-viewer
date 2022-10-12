import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react'
import Geocode from "react-geocode";
import { Input } from 'semantic-ui-react';
 
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
        if (this.state.shop.locationLat === 0 && this.state.shop.locationLng === 0 && this.props.role === 3) {
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
                    lat: this.state.shop.locationLat,
                    lng: this.state.shop.locationLng,
                },
                markerPosition:{
                    lat: this.state.shop.locationLat,
                    lng: this.state.shop.locationLng
                }
            })
        }
    }

    convertNumber(str) {
        return str.replace(/[A-Za-z0-9]/g, function(s) {
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

    addressSearch(address) {
        Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
        Geocode.setLanguage('ko');
        Geocode.fromAddress(address)
            .then(response => {
                const newLat = response.results[0].geometry.location.lat;
                const newLng  = response.results[0].geometry.location.lng;
                this.setState({
                    address: address ? address : "",
                    mapPosition:{
                        lat: newLat,
                        lng: newLng,
                    },
                    markerPosition:{
                        lat: newLat,
                        lng: newLng
                    }
                })
            });
    }

    onMarkerDragEnd(coord) {
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
                    { ...this.props.shop, locationLat: newLat, locationLng: newLng }
                );
                this.props.setLocationSearch(address);
            })
    }

    render() {
        return (
            <div className='map-container'>
            {(this.state.mapPosition.lat && this.state.mapPosition.lng) &&
            <>
            {this.props.editMode &&
            <Input 
                placeholder='핀을 움직이거나 주소를 검색해주세요'
                className='search-bar'
                iconPosition='left'
                icon='point'
                action={{ icon: 'search', onClick: () => this.addressSearch(this.props.locationSearch) }}
                value={this.props.value ? this.props.value : ''}
                onChange={(e) => this.props.changeLocation(e)}
                />
            }
            <Map
                className='google-map'
                google={this.props.google}
                zoom={this.state.zoom}
                mapTypeControl={false}
                streetViewControl={false}
                keyboardShortcuts={false}
                initialCenter={{lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng}}
                center={this.state.mapPosition && this.state.mapPosition}
            >
            <Marker
                position={{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng}}
                draggable={this.props.editMode}
                onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
            />
            </Map>
            </>
            }
            </div>
        );
  }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    language: 'ko'
})(MapContainer)