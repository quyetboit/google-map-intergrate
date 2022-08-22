import { AfterViewInit, Component, Input } from '@angular/core';
import { async } from '@angular/core/testing';
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

  // Drawing Libary
  drawingManager!: google.maps.drawing.DrawingManager;

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
    // this.makeDrawingTool();
    this.makePlaceSearch();
  }

  initMap() {
    const mapContainer = document.getElementById('map') as HTMLElement;
    this.map = new google.maps.Map(
      mapContainer,
      {
        center: new google.maps.LatLng(21.037559730072303, 105.83498946276866),
        zoom: 15,
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        disableDefaultUI: true
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
        console.log('Result search map: ', result)
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
    this.directionRender.setPanel(
      document.getElementById('sidebar') as HTMLElement
    )

    this.directionRender.setMap(this.map)
    searchBtn.addEventListener('click', () => {
      Promise.all([this.getPlaceIdByAdressSearch(inputTextStart.value), this.getPlaceIdByAdressSearch(inputTextEnd.value)])
        .then(result => {
          let startPoint = result[0]
          let endPoint = result[1]
          this.calculateAndDisplayRoute(startPoint, endPoint)
        })
    })
  }
  calculateAndDisplayRoute(start: any, end: any) {
    // tìm đường
    this.directionService
    .route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING
    })
    .then(respon => {
      console.log('Respon direction: ', respon)
      this.directionRender.setDirections(respon)
    })
  }

  async getPlaceIdByAdressSearch(address: string) {
    let latLng;
    await this.geocoder.geocode({address})
      .then((result) => {
        const { results } = result;
        latLng = results[0].geometry.location;
        latLng = {
          lat: latLng.lat(),
          lng: latLng.lng()
        }
      })
    return latLng
  }

  makeDrawingTool() {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      markerOptions: {
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      },
      circleOptions: {
        fillColor: "#ffff00",
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1,
      }
    });
    this.drawingManager.setMap(this.map)
  }

  makePlaceSearch() {
    const inputSearchPlace = document.createElement('input');
    inputSearchPlace.type = 'text';
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(inputSearchPlace);

    const searchBox = new google.maps.places.SearchBox(inputSearchPlace)

    this.map.addListener("bounds_changed", () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    let markers: google.maps.Marker[] = [];

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();// Lấy tất cả các địa điểm matching với địa điểm nhập trong ô input

      console.log("Place: ", places)

      if (places?.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = []; //reset marker array

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();


      //Đánh dấu tất cả các địa điểm tìm được matching với kết quả nhập trong search box
      places?.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const icon = {
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_icon_orange_3.svg/1200px-Flag_icon_orange_3.svg.png',
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map: this.map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );

        // Phần này để mở giới hạn(bound) của viewport (Mục đích là để có thể nhìn thấy tất cả các địa điểm tìm kiếm trong 1 khung nhìn)
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  }
}

function handleLocationError(arg0: boolean, infoWindow: any, arg2: any) {
  throw new Error('Function not implemented.');
}

