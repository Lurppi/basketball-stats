import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Importiere alle 16 Bilder aus dem src/images Ordner
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import img4 from '../images/img4.jpg';
import img5 from '../images/img5.jpg';
import img6 from '../images/img6.jpg';
import img7 from '../images/img7.jpg';
import img8 from '../images/img8.jpg';
import img9 from '../images/img9.jpg';
import img10 from '../images/img10.jpg';
import img11 from '../images/img11.jpg';
import img12 from '../images/img12.jpg';
import img13 from '../images/img13.jpg';
import img14 from '../images/img14.jpg';
import img15 from '../images/img15.jpg';
import img16 from '../images/img16.jpg';

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

  // Array mit den 16 Bildimporten
  const images = [
    img1, img2, img3, img4, img5, img6, img7, img8,
    img9, img10, img11, img12, img13, img14, img15, img16
  ];

  return (
    <div className="home-container">
      <div className="slider-container">
        <div className="carousel">
          <div className="list">
            {images.map((img, index) => (
              <div className="item" key={index}>
                <img src={img} alt={`Slide ${index + 1}`} />
                <div className="content">
                  <div className="author">NBBL</div>
                  <div className="title">LEADERS</div>
                  <div className="topic">2023-2024</div>
                  <div className="des"></div>
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
            {images.map((img, index) => (
              <div className="item" key={index}>
                <img src={img} alt={`Thumbnail ${index + 1}`} />
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
