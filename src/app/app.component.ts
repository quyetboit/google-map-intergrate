import { AfterViewInit, Component } from '@angular/core';
// import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { } from 'google.maps';
// import { } from 'supercluster'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'google-map';
  map!: google.maps.Map;
  listMarker: google.maps.Marker[] = [];
  infoWindow = new google.maps.InfoWindow();

  // Tìm địa điểm
  geocoder!: google.maps.Geocoder;
  makerForGeocoder!: google.maps.Marker;

  // Tìm đường
  directionService!: google.maps.DirectionsService;
  directionRender!: google.maps.DirectionsRenderer;

  locations = [
    {
      lat: 21.037960277874888,
      lng: 105.8233164895782
    },
    {
      lat: 21.032993409004632,
      lng: 105.84168425621617
    },
    {
      lat: 21.026103607111388,
      lng: 105.82975379097
    },
    {
      lat: 21.03844093381633,
      lng: 105.8101843947389
    },
    {
      lat: 21.02410069797314,
      lng: 105.82529059533834
    },
    {
      lat: 21.03371441637221,
      lng: 105.80615035253336
    },

  ]

  ngAfterViewInit() {
    this.initMap();
    this.listMarker = this.locations.map(locaion => {
      return this.addMaker(locaion)
    });
    // this.makeClusterer();
    this.makeInfoWindow();
    this.makePolyline();
    this.makePolygon();
    this.makeCicle();
    this.makeGeoCode();
    this.makeDirection();
  }

  initMap() {
    const mapContainer = document.getElementById('map') as HTMLElement;
    this.map = new google.maps.Map(
      mapContainer,
      {
        center: new google.maps.LatLng(21.037559730072303, 105.83498946276866),
        zoom: 15,
      }
    )
  }

  addMaker(postion: {lat: number, lng: number}) {
    const maker = new google.maps.Marker({
      position: postion,
      map: this.map
    })
    return maker;
  }

  showMarkerInMap(map: google.maps.Map | null) {
    this.listMarker.forEach(marker => {
      marker.setMap(map)
    })
  }

  makeClusterer() {
    // const mc = new MarkerClusterer({map: this.map, markers: this.listMarker});
  }

  getCurrentLocaion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.addMaker(pos)
          this.map.setCenter(pos)

          // this.infoWindow.setPosition(pos);
          // this.infoWindow.setContent("Location found.");
          // this.infoWindow.open(this.map);
          // this.map.setCenter(pos);
        },
        () => {
          handleLocationError(true, this.infoWindow, this.map.getCenter()!);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, this.infoWindow, this.map.getCenter()!);
    }
  }

  makeInfoWindow() {
    this.listMarker.forEach((marker, index) => {
      this.infoWindow.setContent(`This is content ${index}`)
      marker.addListener('click', () => {
        this.infoWindow.open({
          anchor: marker,
          map: this.map
        })
      })
    })

  }

  makePolyline() {
    const lines = [
      { lat: 21.029893609761032, lng: 105.83634008641309 },
      { lat: 21.03588884411761, lng: 105.84008694236361 },
      { lat: 21.03770877824441, lng: 105.83515485646956 },
      { lat: 21.043560964724083, lng: 105.83622538674113 },
    ]

    const fightPath = new google.maps.Polyline({
      path: lines,
      geodesic: true,
      editable: true,
      strokeColor: "black",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    })

    fightPath.setMap(this.map)
  }

  makePolygon() {
    const triangleCoords = [
      { lat: 21.037637408697506, lng: 105.83526955614151 },
      { lat: 21.029572429684848, lng: 105.8251377517855 },
      { lat: 21.021114438595127, lng: 105.85289507239857 },
      { lat: 21.018886147082043, lng: 105.82936714629345 },
      { lat: 21.020371607444932, lng: 105.82936714629345 },
    ]

    const drawTriang = new google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: 'black',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'red',
      fillOpacity: 0.3
    })

    drawTriang.setMap(this.map);
    drawTriang.addListener('click', (event: any) => {
    })
  }

  makeCicle() {
    const circle = new google.maps.Circle({
      center: new google.maps.LatLng(21.00428940515907, 105.80776338793243),
      radius: 1000,
      strokeColor: 'red',
      fillColor: 'red',
      fillOpacity: 0.3,
      editable: true,
      draggable: true
    })
    circle.setMap(this.map)
  }

  makeGeoCode() {
    this.geocoder = new google.maps.Geocoder();

    const inputText = document.createElement("input");

    inputText.type = "text";
    inputText.placeholder = "Enter a location";

    const submitButton = document.createElement("input");

    submitButton.type = "button";
    submitButton.value = "Geocode";
    submitButton.classList.add("button", "button-primary");

    const clearButton = document.createElement("input");

    clearButton.type = "button";
    clearButton.value = "Clear";
    clearButton.classList.add("button", "button-secondary")

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);

    this.makerForGeocoder = new google.maps.Marker({
      map: this.map
    });

    submitButton.addEventListener("click", () =>
      this.geocodeFunctionCall({ address: inputText.value })
    );

    clearButton.addEventListener("click", () => {
      this.makerForGeocoder.setMap(null)
    });
  }

  geocodeFunctionCall(request: google.maps.GeocoderRequest): void {
    this.makerForGeocoder.setMap(null);
    this.geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;

        this.map.setCenter(results[0].geometry.location);
        this.makerForGeocoder.setPosition(results[0].geometry.location);
        this.makerForGeocoder.setMap(this.map);
        return results;
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
  }

  makeDirection() {
    const inputTextStart = document.createElement("input");
    const inputTextEnd = document.createElement("input");

    inputTextStart.type = "text";
    inputTextStart.name = "start";
    inputTextStart.placeholder = "Enter a location start";

    inputTextEnd.type = "text";
    inputTextEnd.name = "end";
    inputTextEnd.placeholder = "Enter a location end";

    const searchBtn = document.createElement("input");

    searchBtn.type = "button";
    searchBtn.value = "Tìm đường";

    this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(inputTextStart);
    this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(inputTextEnd);
    this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(searchBtn);

    this.directionService = new google.maps.DirectionsService();
    this.directionRender = new google.maps.DirectionsRenderer();

    this.directionRender.setMap(this.map)
    searchBtn.addEventListener('click', () => {
      this.calculateAndDisplayRoute(inputTextStart, inputTextEnd)
    })
  }

  calculateAndDisplayRoute(inputTextStart: HTMLInputElement, inputTextEnd: HTMLInputElement) {
    // tìm đường
    this.directionService
    .route({
      origin: {
        query: inputTextStart.value
      },
      destination: inputTextEnd.value,
      travelMode: google.maps.TravelMode.WALKING
    })
    .then(respon => {
      console.log('Respon direction: ', respon)
      this.directionRender.setDirections(respon)
    })
  }
}

function handleLocationError(arg0: boolean, infoWindow: any, arg2: any) {
  throw new Error('Function not implemented.');
}

