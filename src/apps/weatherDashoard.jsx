import React, { Component } from "react";
import './weather.scss';
import moment from "moment";
var classNames = require('classnames');

export class Weather extends Component {
  constructor(props, context) {
    super();
  }
  state = {
    weatherData: [],
    cityName: '',
  };
  componentDidMount() {
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 5 * (60 * 1000));
  };
  componentWillUnmount() {
    clearInterval();
  };
  goto(index) {
    let weatherData = {
      city: this.state.cityName,
      date: this.state.weatherData[index].dt_txt,
      max_temp: this.state.weatherData[index].main.temp_max,
      min_temp: this.state.weatherData[index].main.temp_min,
      temp: this.state.weatherData[index].main.temp,
      iconName: this.state.weatherData[index].weather[0].id,
      bgColorClass: this.state.weatherData[index].main.bgColorClass,
      description: this.state.weatherData[index].weather[0].description,
      feels_like_temp: this.state.weatherData[index].main.feels_like,
    }
    this.props.history.push('/weather', { params: this.state.weatherData[index].hourlyData, weatherData: weatherData });
  };
  fetchData() {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=pune&units=metric&appid=e86d0cb5069d817a8ac2d4deb3c33391')
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        let city = data.city.name + ', ' + data.city.country;
        this.setState({ cityName: city })
        data.list.forEach(element => {
          element.hourlyData = []
        });
        const newList = []
        newList.push(data.list[0])
        for (let i = 0; i < data.list.length; i++) {
          if (moment(newList[newList.length - 1].dt_txt).format('MM-DD-YYYY') !== moment(data.list[i].dt_txt).format('MM-DD-YYYY') && newList.length !== 5) {
            newList.push(data.list[i]);
          } else {
            newList[newList.length - 1].hourlyData.push(data.list[i])
          }
        }
        this.setState({ weatherData: newList });
      })
      .catch({})
  }
  render() {
    if (this.state.weatherData.length > 0) {
      this.state.weatherData.forEach((data) => {
        data.main.bgColorClass = 'weather-widget ';
        if (data.main.temp >= 30) {
          data.main.bgColorClass += 'very-warm';
        }
        else if (data.main.temp > 20 && data.main.temp < 30) {
          data.main.bgColorClass += 'warm';
        }
        else if (data.main.temp > 10 && data.main.temp < 20) {
          data.main.bgColorClass += 'normal';
        }
        else if (data.main.temp > 0 && data.main.temp < 10) {
          data.main.bgColorClass += 'cold';
        }
        else if (data.main.temp <= 0) {
          data.main.bgColorClass += 'very-cold';
        }
      })
    }
    return (
      <div className="main-container bgColorClass">
        <div className="header-card">
          <h2 className="header">
            5-Day Forecast.
          </h2>
        </div>
        <div>
          <p className="cityName">{this.state.cityName}</p>
        </div>
        <div className="weather-xards-wrapper">
          {this.state.weatherData.map((data, i) => {
            const { main } = data;
            return (
              <div className="weather-card" key={i} onClick={() => this.goto(i)}>
                <p className="day-title">{moment(data.dt_txt).format('dddd')}</p>
                <p className="date-month-title">{moment(data.dt_txt).format('MMM DD, HH:MM a')}</p>
                <div className={main.bgColorClass}>
                  <div className="weather">
                    <i className={classNames('wi wi-owm-' + data.weather[0].id)} id="weather-icon" height="60"></i>
                  </div>
                </div>
                <p className="temperature-title">{main.temp}°</p>
                <p className="sky-title">{data.weather[0].description}</p>
              </div>
            )
          })
          }
        </div>
      </div>
    );
  }
}

export default Weather;