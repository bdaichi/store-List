import { Button, IconButton } from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import RoomIcon from '@mui/icons-material/Room';
import LocationOffIcon from '@mui/icons-material/LocationOff';

import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';

const mapContainerStyle = {
    height: 400,
    width: 400,
};

const options = {
    enableHighAccuracy: true,
    disableDefaultUI: true,
    // デフォルトUI（衛星写真オプションなど）をキャンセルします。
    zoomControl: true,
};

type Props = {
    setShopLocation: any
    shopLocation: number[] | null
    isDisplayRouteGuidance: boolean
    isDisplaySearchDestination: boolean
    prefecture: string
}

export default function GoogleMapFeild(props: Props) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyChtGG5A7NTWuXXvwPjCiWiM6a-y_pnt9o",
        libraries: ['places'],
    });

    const [currentLocation, setCurrentLocation] = useState<any>()
    const [isDisplayDestinationMarker, setIsDisplayDestinationMarker] = useState(true)
    const [destination, setDestination] = useState<google.maps.LatLng | null>(null)
    const [isRouteGuidance, setIsRouteGuidance] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isHideButton, setIsHideButton] = useState(true)

    //経路検索ボタン
    const setRouteGuidance = () => {
        setIsRouteGuidance(true)
        setIsDisplayDestinationMarker(false)
        setIsHideButton(false)
    }

    const hideRouteGuidance = () => {
        setCurrentLocation(null)
        setIsDisplayDestinationMarker(true)
        setIsHideButton(true)
    }

    const searchRouteGuidance = async (directionsRenderer: google.maps.DirectionsRenderer) => {
        const directionsService = new google.maps.DirectionsService();
        console.log('searchRouteGuidance currentLocation', currentLocation)
        if (currentLocation && destination) {
            await directionsService
                .route({
                    origin: currentLocation,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                })
                .then((response) => {
                    directionsRenderer.setDirections(response);
                })
                .catch((e) => window.alert("Directions request failed due to " + status));
            setIsRouteGuidance(false)
            setIsLoading(false)
        } else {
            setIsRouteGuidance(false)
        }
    }

    const getCurrentLocation = async (map: google.maps.Map) => {
        const infoWindow = new google.maps.InfoWindow();
        setIsLoading(true)

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent("現在地");
                    infoWindow.open(map);
                    setCurrentLocation(pos)
                },
                (e) => {
                    console.log('google_map_field errorMessage', e.message)
                    handleLocationError(true, infoWindow, map.getCenter()!);
                    setIsRouteGuidance(false)
                }
            );
        }

        const handleLocationError = (
            browserHasGeolocation: boolean,
            infoWindow: google.maps.InfoWindow,
            pos: google.maps.LatLng
        ) => {
            infoWindow.setPosition(pos);
            infoWindow.setContent(
                browserHasGeolocation
                    ? "Error: The Geolocation service failed."
                    : "Error: Your browser doesn't support geolocation."
            );
        }
        infoWindow.open(map);

    }

    const setShopLocation = (map: google.maps.Map) => {
        if (props.shopLocation != null) {
            console.log('setShopLocation')
            setDestination(new google.maps.LatLng(props.shopLocation[0], props.shopLocation[1]))
        }
    }

    const addIconToMap = async (destination: google.maps.LatLng, map: google.maps.Map) => {
        const icon = {
            url: 'googlemap_marker.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
        };

        let markers: google.maps.Marker[] = [];
        // Create a marker for each place.
        await markers.push(
            new google.maps.Marker({
                map,
                icon,
                position: destination,
            })
        );
        if (!isDisplayDestinationMarker) {
            console.log('hideMarker')
            markers.forEach((marker) => {
                marker.setMap(null);
            });
            markers = [];
        }
    }

    const searchDestination = async (map: google.maps.Map) => {
        const input = document.getElementById("pac-input") as HTMLInputElement;
        if (props.prefecture && !input.value) {
            input.value = props.prefecture
        }
        const searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
        });

        let markers: google.maps.Marker[] = [];

        await searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

            if (places != null) {
                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach((marker) => {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                const bounds = new google.maps.LatLngBounds();

                places.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    console.log('place.geometry.location: ', place.geometry.location)
                    setDestination(place.geometry.location)
                    setDestination(place.geometry.location)
                    if (props.setShopLocation != null) {
                        props.setShopLocation(place.geometry.location)
                    }

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });

                map.fitBounds(bounds);
            }
        });
    }

    const resetInput = () => {
        const input = document.getElementById("pac-input") as HTMLInputElement;
        input.value = '';
    }

    useEffect(() => {
        if (isLoaded && !loadError) {
            if (destination == null && props.isDisplaySearchDestination) {
                setDestination(new google.maps.LatLng({
                    lat: 35.69022950509621,
                    lng: 139.74220232332235,
                }))
            }
            const directionsRenderer = new google.maps.DirectionsRenderer();
            const map = new google.maps.Map(
                document.getElementById("map") as HTMLElement,
                {
                    center: props.isDisplayRouteGuidance ? destination : destination,
                    zoom: 13,
                    mapTypeId: "roadmap",
                });


            directionsRenderer.setMap(map);
            if (props.isDisplayRouteGuidance) {
                if (destination == null) {
                    setShopLocation(map)
                }
                if (destination) {
                    addIconToMap(destination, map)
                }
                if (isRouteGuidance) {
                    getCurrentLocation(map)
                }
                searchRouteGuidance(directionsRenderer)
            }
            if (props.isDisplaySearchDestination) {
                searchDestination(map)
                if (destination) {
                    addIconToMap(destination, map)
                }
            }
        }
    }, [isLoaded, isRouteGuidance, destination, currentLocation, destination, props.prefecture])


    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    if (isLoaded && !loadError) {
        return (
            <>
                <div className='flex flex-col '>{props.isDisplaySearchDestination &&
                    <div className='flex flex-row'>
                        <input
                            id="pac-input"
                            className="controls shadow-lg rounded-md h-12 w-72 ml-12"
                            type="text"
                            placeholder={props.prefecture ? props.prefecture : '場所を検索'}
                            style={{ padding: 6, borderWidth: 2, borderColor: '#00a6af', fontFamily: '筑紫A丸ゴシック', }}
                        />
                        <IconButton onClick={resetInput}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                }<div className='flex justify-center flex-col my-3'>{props.isDisplayRouteGuidance &&
                    <>
                        <div className='mx-4 my-2 pr-4'>{isLoading ?
                            <Dialog open={isLoading}>
                                <CircularProgress className='m-10' style={{ color: '#00a6af', }} />
                            </Dialog>
                            :
                            <div className='flex justify-center'>{isHideButton &&
                                <Button
                                    variant='contained'
                                    onClick={setRouteGuidance}
                                    style={{ backgroundColor: '#00a6af', color: 'white', width: 210, height: 50, }}
                                >
                                    <p className='text-lg ml-4' style={{ fontFamily: '筑紫A丸ゴシック' }}>
                                        経路を検索
                                    </p>
                                    <IconButton><RoomIcon style={{ color: 'white', width: 30, height: 30, }} /></IconButton>
                                </Button>
                            }</div>
                        }</div>
                        <div className='flex justify-center my-2'>{!isHideButton &&
                            <Button
                                variant='contained'
                                onClick={hideRouteGuidance}
                                style={{ backgroundColor: '#00a6af', color: 'white', width: 210, height: 50, }}
                            >
                                <p className='text-xl ml-4' style={{ fontFamily: '筑紫A丸ゴシック' }}>経路を消す</p>
                                <IconButton><LocationOffIcon style={{ color: 'white', width: 30, height: 30, }} /></IconButton>
                            </Button>
                        }</div>
                    </>
                }</div>
                    <div className='flex justify-center flex-col shadow-2xl mr-2 md:'>
                        <GoogleMap
                            id="map"
                            mapContainerStyle={mapContainerStyle}
                            zoom={8}
                            options={options}
                            onLoad={onMapLoad}
                        >
                        </GoogleMap>
                    </div>
                    <script
                        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyChtGG5A7NTWuXXvwPjCiWiM6a-y_pnt9o&callback=initAutocomplete&libraries=places&v=weekly"
                        async
                    ></script>
                </div>
            </>
        )
    } else {
        return (
            <div>

            </div>
        )
    }

}