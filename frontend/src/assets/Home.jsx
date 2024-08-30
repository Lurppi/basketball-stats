import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  useEffect(() => {
    const nextDom = document.getElementById('next');
    const prevDom = document.getElementById('prev');
    const carouselDom = document.querySelector('.carousel');
    const sliderDom = carouselDom.querySelector('.list');
    const thumbnailBorderDom = document.querySelector('.thumbnail');
    const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
    const timeRunning = 3000;
    const timeAutoNext = 7000;

    let runTimeOut;
    let runNextAuto;

    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);

    const showSlider = (type) => {
      const sliderItemsDom = sliderDom.querySelectorAll('.item');
      const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');

      if (type === 'next') {
        sliderDom.appendChild(sliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
      } else {
        sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
      }

      clearTimeout(runTimeOut);
      runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
      }, timeRunning);

      clearTimeout(runNextAuto);
      runNextAuto = setTimeout(() => {
        nextDom.click();
      }, timeAutoNext);
    };

    nextDom.onclick = () => showSlider('next');
    prevDom.onclick = () => showSlider('prev');

    runNextAuto = setTimeout(() => {
      nextDom.click();
    }, timeAutoNext);
  }, []);

  return (
    <div className="home-container">
      <div className="slider-container">
        <div className="carousel">
          <div className="list">
            {[...Array(16)].map((_, index) => (
              <div className="item" key={index}>
                <img src={`./src/images/img${index + 1}.jpg`} alt={`Slide ${index + 1}`} />
                <div className="content">
                  <div className="author">NBBL</div>
                  <div className="title">Season</div>
                  <div className="topic">Leaders</div>
                  <div className="des">
                    Advanced Metrics 
                  </div>
                  <div className="buttons">
                    <Link to="/players">
                      <button>PLAYERS</button>
                    </Link>
                    <Link to="/teams">
                      <button>TEAMS</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="thumbnail">
            {[...Array(16)].map((_, index) => (
              <div className="item" key={index}>
                <img src={`./src/images/img${index + 1}.jpg`} alt={`Thumbnail ${index + 1}`} />
                <div className="content">
                  <div className="title"></div>
                  <div className="description"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="arrows">
            <button id="prev">&lt;</button>
            <button id="next">&gt;</button>
          </div>
          <div className="time"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
