import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
 
export class MapContainer extends Component {
  render() {
    const location = this.props.location;
    return (
        <div className='map-container'>
        <Map
            className='google-map'
            google={this.props.google}
            zoom={16}
            mapTypeControl={false}
            streetViewControl={false}
            keyboardShortcuts={false}
            initialCenter={{ lat: 37.5, lng: 127}}
        >
          <Marker position={{ lat: 37.5, lng: 127}} />
        </Map>
        </div>
    );
  }
}
 

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCEP8l9Pe7skIiL1KiXd54DZUHKSn8aTg0',
  language: 'ko'
})(MapContainer)