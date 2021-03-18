import React from "react";
import './weatherdetail.scss';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import moment from "moment";
import { GradientTealBlue } from '@visx/gradient';
var classNames = require('classnames');

export const Weathers = (props) => {
  const weatherData = props.location.state.weatherData;
  const data = [];
  props.location.state.params.forEach(element => {
    let obj = {
      frequency: element.main.temp,
      letter: moment(element.dt_txt).format('hh:mm A')
    }
    data.push(obj)
  })

  const verticalMargin = 120;
  // Define the graph dimensions and margins
  const width = 700;
  const height = 300;
  const margin = { top: 20, bottom: 20, left: 20, right: 20 };

  // Then we'll create some bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // We'll make some helpers to get at the data we want
  const x = d => d.letter;
  const y = d => d.frequency;

  // And then scale the graph by our data
  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: data.map(x),
    padding: 0.82,
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(y))],
  });

  // Compose together the scale and accessor functions to get point functions
  const compose = (scale, accessor) => data => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  return (
    <div>
      <div className="details-container">
        <div className="weather-container">
          <p className="location">{weatherData.city}</p>
          <p className="date">{moment(weatherData.date).format('ddd DD MMMM hh:mm A')}</p>
          <div className="flex-wrapper">
            <div className="weather-detail">
              <div className={weatherData.bgColorClass}>
                <i className={classNames('wi wi-owm-' + weatherData.iconName)}></i>
              </div>
              <p className="temperature">{weatherData.temp}°</p>
            </div>
            <p className="temp-description">{weatherData.max_temp}° / {weatherData.min_temp}°  |  Feels like  {weatherData.feels_like_temp}° </p>
          </div>
          <p className="sky-description">{weatherData.description}</p>
        </div>
      </div>
      <div className="grapContainer">
        <svg width={1000} height={400}>
          <GradientTealBlue id="teal" />
          <rect width={1000} height={450} fill="url(#teal)" rx={0} />
          <Group left={180} top={verticalMargin / 2}>
            <AxisBottom
              scale={xScale}
              top={yMax}
              label={'Hours'}
              stroke={'#1b1a1e'}
              tickTextFill={'#1b1a1e'}
            />
            {data.map((d, i) => {
              const barHeight = yMax - yPoint(d);
              return (
                <Group key={`bar-${i}`}>
                  <Bar
                    x={xPoint(d)}
                    y={yMax - barHeight}
                    height={barHeight}
                    width={20}
                    fill="rgba(23, 233, 217, .5)"
                  />
                </Group>
              );
            })}
            <AxisLeft
              scale={yScale}
              top={0}
              left={0}
              label={'Temperature'}
              stroke={'#1b1a1e'}
              tickTextFill={'#1b1a1e'}
            />
          </Group>
        </svg>
      </div>
    </div>
  );
};

export default Weathers;