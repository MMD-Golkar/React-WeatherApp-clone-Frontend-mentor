import { useState , useEffect} from "react";
export default function MainContent() {
  const [weekDaystatus, setWeekDayStatus] = useState(false);
  const [weekDaytext, setWeekDayText] = useState(new Date().toLocaleDateString("en-US", 
  {
    timeZone: "Asia/Tehran",
    weekday: "long",
  }));
  const [weatherdata, setWeatherData] = useState();
  const [cityAndCountry, setCityAndCountry] = useState("tehran");
  const [latAndLong, setLatAndLong] = useState({lat: '52.5173885', long: '13.3951309'});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tempUnit, setTempUnit] = useState("°C");
  const [windUnit, setWindUnit] = useState("km/h");
  const [precipitationUnit, setPrecipitationUnit] = useState("mm");
  const [unitesStatus, setUnitesStatus] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isKmh, setIsKmh] = useState(true);
  const [isMph, setIsMph] = useState(false);
  const [isMillimeters, setIsMillimeters] = useState(true);
  const [isInches, setIsInches] = useState(false);
  const [ismetric , setIsMetric] = useState(false);
  const [isImperial , setIsImperial] = useState(true);

    //toggles to on and off Unites button on header
   function UniteStatus() {
    !unitesStatus ? setUnitesStatus(true) : setUnitesStatus(false);
  }

  //celsius toggle function
  function celsiusStatus() {
    if (!isCelsius) {
      setIsCelsius(true);
      setIsFahrenheit(false);
      setTempUnit("°C");
    }
  }

  //fahrenheit toggle function
  function fahrenheitStatus() {
    if (!isFahrenheit) {
      setIsFahrenheit(true);
      setIsCelsius(false);
      setTempUnit("°F");
    }
  }

  //km per hour toggle function
  function kmhStatus() {
    if (!isKmh) {
      setIsKmh(true);
      setIsMph(false);
      setWindUnit("km/h");
    }
  }

  //mile per hour toggle function
  function mphStatus() {
    if (!isMph) {
      setIsMph(true);
      setIsKmh(false);
      setWindUnit("mph");
    }
  }

  //millimeter toggle function
  function millimetersStatus() {
    if (!isMillimeters) {
      setIsMillimeters(true);
      setIsInches(false);
      setPrecipitationUnit("mm");
    }
  }

  //inch toggle function
  function inchestStatus() {
    if (!isInches) {
      setIsInches(true);
      setIsMillimeters(false);
      setPrecipitationUnit("in");
    }
  }

  //switches between metric and imperial
  function switchtometric() {
    if (isImperial) {
      setIsImperial(false);
      setIsMetric(true);
      setTempUnit("°F");
      setWindUnit("mph");
      setPrecipitationUnit("in");
    }else if(!isImperial){
      setIsImperial(true);
      setIsMetric(false);
      setTempUnit("°C");
      setWindUnit("km/h");
      setPrecipitationUnit("mm");
    }
  }

  //fetches data every time unit changes
  useEffect(()=>{
      fetchWeatherData();
    } , [isImperial]);

    //toggles to on and off weekday dropdown button(removed temperarly)
  function weekdaytoggle() {
    if (!weekDaystatus) setWeekDayStatus(true);
    else if (weekDaystatus) setWeekDayStatus(false);
  }

  //prevents the page from reloading on form submit
  function handlesubmit(e){
    e.preventDefault();
  }

  //functions running when the Search button is clicked
  function searchbtnfuncs(){
    setLoading(true);
    setCityAndCountry(inputValue);
  }

  //setting weather condition images based on fetched weather code from api
  function getweathericon(weathercode){
    if(weathercode === 0){
      return "../src/assets/images/icon-sunny.webp";
    }else if(weathercode >= 1 && weathercode <= 3){
      return "../src/assets/images/icon-partly-cloudy.webp";
    }else if(weathercode >= 45 && weathercode <= 48){
      return "../src/assets/images/icon-fog.webp";
    }else if(weathercode >= 51 && weathercode <= 67){
      return "../src/assets/images/icon-drizzle.webp";
    }else if(weathercode >= 71 && weathercode <= 77){
      return "../src/assets/images/icon-snow.webp";
    }else if(weathercode >= 95){
      return "../src/assets/images/icon-thunderstorm.webp";
    }
      return "../src/assets/images/icon-sunny.webp";
  }

    //this function below will fetch the weather data from api and set it to weatherdata state
    // also handles errors if there is any problem with fetching data from api or if the user is offline
    async function fetchWeatherData() {
    if (!navigator.onLine) {
      setError(true);
      return;
    }
    try{
      setError(false);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latAndLong.lat}&longitude=${latAndLong.long}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&forecast_hours=24&temperature_unit=${tempUnit === "°C" ? "celsius" : "fahrenheit"}&windspeed_unit=${windUnit === "km/h" ? "kmh" : "mph"}&precipitation_unit=${precipitationUnit === "mm" ? "mm" : "inch"}&timezone=auto`
    );
    if(!res.ok){
      throw new Error("Something went wrong!");
    }
    const result = await res.json();
    setWeatherData(result)
    setError(false);
    }catch(err){
      setError(true);
      console.log(err);
    }finally{
    setLoading(false);
    }
  }
    //this function will fetch the city and country name based on lon or lat from the api above
    // ********* this function will run first then will run the one above **********
    async function fetchCityAndCountry() {
      try {
        setLoading(true);
        const res = await fetch(`https://geocode.maps.co/search?q=${cityAndCountry}&api_key=699dfd1d708ea910992554bauee06b2`);
        const result = await res.json();
        if (result.length > 0) {
          setCityAndCountry(result[0].display_name);
          setLatAndLong({ lat: result[0].lat, long: result[0].lon });
        }
      } catch (err) {
        console.error("Something went wrong: ", err);
      } finally {
        fetchWeatherData();
      }
    }
  
  //fetching the api inside useEffect will prevent infinite loop or rerendering
  useEffect(() => {
    fetchCityAndCountry();
}, [cityAndCountry]);








  //temperary moved all components to the same file
  return (
    <>
      {/*header component*/}
       <div className="header">
        <img
          src="../src/assets/images/logo.svg"
          alt="Logo"
          className="header-logo"
        />

        <button
          className="header-dropdown"
          onClick={UniteStatus}
          style={{
            outline: unitesStatus ? "2px solid white" : "none",
            border: unitesStatus ? "2px solid black" : "none",
          }}
        >
          <img src="../src/assets/images/icon-units.svg" />
          <p>Unites</p>
          <img src="../src/assets/images/icon-dropdown.svg" />
        </button>

        <div
          className="header-dropdown-content"
          style={{ display: unitesStatus ? "flex" : "none" }}
        >
          <button className="switch-imperial-btn" onClick={switchtometric}>Switch to {!isImperial ? "Metric" : "Imperial"}</button>
          <p className="temperature-type-text">Temperature</p>

          <button
            className="celsius-btn"
            onClick={celsiusStatus}
            style={{
              backgroundColor: isCelsius
                ? "rgba(99, 99, 99, 0.288)"
                : "transparent",
            }}
          >
            <p>Celsius(°C)</p>
            {isCelsius && <img src="../src/assets/images/icon-checkmark.svg" />}
          </button>

          <button
            className="fahrenheit-btn"
            onClick={fahrenheitStatus}
            style={{
              backgroundColor: isFahrenheit
                ? "rgba(99, 99, 99, 0.288)"
                : "transparent",
            }}
          >
            <p>Fahrenheit(°F)</p>
            {isFahrenheit && (
              <img src="../src/assets/images/icon-checkmark.svg" />
            )}
          </button>
          <span className="seprate-line"></span>
          <p className="windspeed-type-text">Wind Speed</p>
          <button
            className="kmh-btn"
            onClick={kmhStatus}
            style={{
              backgroundColor: isKmh
                ? "rgba(99, 99, 99, 0.288)"
                : "transparent",
            }}
          >
            <p>km/h</p>
            {isKmh && <img src="../src/assets/images/icon-checkmark.svg" />}
          </button>
          <button
            className="mph-btn"
            onClick={mphStatus}
            style={{
              backgroundColor: isMph
                ? "rgba(99, 99, 99, 0.288)"
                : "transparent",
            }}
          >
            <p>mph</p>
            {isMph && <img src="../src/assets/images/icon-checkmark.svg" />}
          </button>
          <span className="seprate-line"></span>

          <p className="precipitation-type-text">Precipitation</p>
          <button
            className="millimeters-btn"
            onClick={millimetersStatus}
            style={{
              backgroundColor: isMillimeters
                ? "rgba(99, 99, 99, 0.288)"
                : "transparent",
            }}
          >
            <p>Millimeters (mm)</p>
            {isMillimeters && (
              <img src="../src/assets/images/icon-checkmark.svg" />
            )}
          </button>
          <button
            className="inches-btn"
            onClick={inchestStatus}
            style={{
              backgroundColor: isInches
                ? "rgba(99, 99, 99, 0.288)"
                : "transparent",
            }}
          >
            <p>Inches (in)</p>
            {isInches && <img src="../src/assets/images/icon-checkmark.svg" />}
          </button>
        </div>
      </div>
      
      {/* bluring top of page on mobile dropdown Unites */}
      <div className="dropdown-blurbg" style={{display: unitesStatus ? "inline" : "none"}}></div>

      {/*Search section component */}
     {!error && <div className="searchsection-wrapper">
        <h1>How's the sky looking today?</h1>
        <form onSubmit={handlesubmit}>
          <img src="../src/assets/images/icon-search.svg" className="search-icon"/>
          <input type="text" className="location-input" placeholder="Search for place..." value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
          <button type="submit" className="search-btn" onClick={searchbtnfuncs}>Search</button>
        </form>
      </div>}

      {/* everything below the search input and button starts from here */}
      {!error && <div className="container">
        <div className="left-side-content">
          <div className="location-date-temp" style={{background: loading && "rgba(147, 160, 185, 0.26)"}}>
            {loading && <h3 className="Loading-text" style={{color: "rgb(194, 194, 194)" , position: "absolute" , left: "43%"}}>Loading...</h3>}
            <div className="location-date-div">
              <h1 className="location" style={{opacity: loading ? "0" : "1"}}>{cityAndCountry}</h1>
              <p className="date" style={{opacity: loading ? "0" : "1"}}>{new Date().toLocaleDateString("en-US", {
                timeZone: "Asia/Tehran",   
                weekday: "long",          
                month: "short",           
                day: "numeric",           
                year: "numeric",
                })}
              </p>
            </div>
            <div className="temp-div">
              <img
                src="../src/assets/images/icon-sunny.webp"
                className="temp-icon"
                style={{opacity: loading ? "0" : "1"}}
              />
              <h1 className="temp" style={{opacity: loading ? "0" : "1"}}>{Math.round(weatherdata?.current?.temperature_2m)}°</h1>
            </div>
          </div>

          <div className="fhwp-container">
            <div className="fhwp-div1">
              <p>Feels Like</p>
              {!loading ? <h2>{weatherdata?.current?.apparent_temperature}°</h2> : <h2>_</h2>}
            </div>
            <div className="fhwp-div">
              <p>Humidity</p>
              {!loading ?<h2>{weatherdata?.current?.relative_humidity_2m}%</h2> : <h2>_</h2>}
            </div>
            <div className="fhwp-div">
              <p>Wind</p>
              {!loading ? <h2>{weatherdata?.current?.wind_speed_10m} {windUnit}</h2> : <h2>_</h2>}
            </div>
            <div className="fhwp-div4">
              <p>Precipitation</p>
              {!loading ? <h2>{weatherdata?.current?.precipitation} {precipitationUnit}</h2> : <h2>_</h2>}
            </div>
          </div>

          <p className="daily-forecast-text">Daily forecast</p>

          <div className="daily-forecast-wrapper">
            <div className="daily-forecast-container1">
              <div className="daily-forecast-div">
                <p style={{display : loading && "none"}}>Tue</p>
                <img src={getweathericon(weatherdata?.daily?.weather_code[3])} style={{display : loading && "none"}}/>
                <div className="temps2">
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_max[3])}°</p>
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_min[3])}°</p>
                </div>
              </div>
            </div>

            <div className="daily-forecast-container">
              <div className="daily-forecast-div">
                <p style={{display : loading && "none"}}>Wed</p>
                <img src={getweathericon(weatherdata?.daily?.weather_code[4])} style={{display : loading && "none"}}/>
                <div className="temps2">
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_max[4])}°</p>
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_min[4])}°</p>
                </div>
              </div>
            </div>

            <div className="daily-forecast-container">
              <div className="daily-forecast-div">
                <p style={{display : loading && "none"}}>Thu</p>
                <img src={getweathericon(weatherdata?.daily?.weather_code[5])} style={{display : loading && "none"}}/>
                <div className="temps2">
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_max[5])}°</p>
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_min[5])}°</p>
                </div>
              </div>
            </div>

            <div className="daily-forecast-container">
              <div className="daily-forecast-div">
                <p style={{display : loading && "none"}}>Fri</p>
                <img src={getweathericon(weatherdata?.daily?.weather_code[6])} style={{display : loading && "none"}} />
                <div className="temps2">
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_max[6])}°</p>
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_min[6])}°</p>
                </div>
              </div>
            </div>

            <div className="daily-forecast-container">
              <div className="daily-forecast-div">
                <p style={{display : loading && "none"}}>Sat</p>
                <img src={getweathericon(weatherdata?.daily?.weather_code[0])} style={{display : loading && "none"}}/>
                <div className="temps2">
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_max[0])}°</p>
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_min[0])}°</p>
                </div>
              </div>
            </div>

            <div className="daily-forecast-container">
              <div className="daily-forecast-div">
                <p style={{display : loading && "none"}}>Sun</p>
                <img src={getweathericon(weatherdata?.daily?.weather_code[1])} style={{display : loading && "none"}}/>
                <div className="temps2">
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_max[1])}°</p>
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_min[1])}°</p>
                </div>
              </div>
            </div>

            <div className="daily-forecast-container7">
              <div className="daily-forecast-div">
                <p style={{display : loading && "none"}}>Mon</p>
                <img src="../src/assets/images/icon-rain.webp" style={{display : loading && "none"}}/>
                <div className="temps2">
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_max[2])}°</p>
                  <p style={{display : loading && "none"}}>{Math.round(weatherdata?.daily?.temperature_2m_min[2])}°</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-side-content">
          <div className="hourly-forecast-wrapper">
            <p className="hourly-forecast-text">Hourly forecast</p>
            <button className="weekday-dropdown-btn" onClick={weekdaytoggle}>
              {!loading ? <p>{weekDaytext}</p> : <p>_</p>}
            </button>
          </div>
          <div className="hourly-forecast-content">
            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[0])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>10 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[0])}°</p>
            </button>
            
            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[1])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>11 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[1])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[2])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>12 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[2])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[3])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>1 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[3])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[4])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>2 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[4])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[5])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>3 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[5])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[6])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>4 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[6])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[7])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>5 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[7])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[8])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>6 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[8])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[9])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>7 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[9])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[10])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>8 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[10])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[11])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>9 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[11])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[12])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>10 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[12])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[13])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>11 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[13])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[14])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>12 AM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[14])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[15])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>1 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[15])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[16])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>2 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[16])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[17])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>3 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[17])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[18])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>4 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[18])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[19])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>5 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[19])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[20])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>6 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[20])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[21])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>7 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[21])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[22])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>8 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[22])}°</p>
            </button>

            <button className="hourly-forecast-btn">
              <img src={getweathericon(weatherdata?.hourly?.weather_code[23])} style={{opacity : loading && "0"}}/>
              <h3 style={{opacity : loading && "0"}}>9 PM</h3>
              <p style={{opacity : loading && "0"}}>{Math.round(weatherdata?.hourly?.temperature_2m[23])}°</p>
            </button>
          </div>
        </div>
      </div>}
      
      {/* this component runs only when there is an error fetching data from API */}
      {error && <div className="error-content-container">
        <img src="../src/assets/images/icon-error.svg" alt="icon" />
        <h1>Something went wrong</h1>
        <p>We couldn't connect to the server(API error). Please try</p>
        <p>again in a few moments.</p>
        <button>
          <img src="../src/assets/images/icon-retry.svg" />
          <p onClick={fetchWeatherData}>Retry</p>
        </button>
      </div>}
    </>
  );
}
