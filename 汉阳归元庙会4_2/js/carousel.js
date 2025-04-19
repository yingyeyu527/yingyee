class Carousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.items = Array.from(container.querySelectorAll('.carousel-item'));
    this.currentIndex = 0;
    this.startX = 0;
    this.isDragging = false;
    this.autoPlayInterval = null;

    // 初始化
    this.createIndicators();
    this.addEventListeners();
    this.autoPlay();
  }

  createIndicators() {
    const indicatorsContainer = this.container.querySelector('.carousel-indicators');
    this.items.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (index === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => this.goToSlide(index));
      indicatorsContainer.appendChild(indicator);
    });
  }

  addEventListeners() {
    // 触摸事件
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // 鼠标事件
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));

    // 导航箭头
    this.container.querySelector('.arrow-prev').addEventListener('click', () => this.prevSlide());
    this.container.querySelector('.arrow-next').addEventListener('click', () => this.nextSlide());
  }

  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.isDragging = true;
    this.track.style.transition = 'none';
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - this.startX;
    this.updateTrackPosition(diff);
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - this.startX;
    this.handleSwipe(diff);
    this.track.style.transition = 'transform 0.3s ease';
  }

  handleMouseDown(e) {
    this.startX = e.clientX;
    this.isDragging = true;
    this.track.style.transition = 'none';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - this.startX;
    this.updateTrackPosition(diff);
  }

  handleMouseUp() {
    this.isDragging = false;
    const diff = event.clientX - this.startX;
    this.handleSwipe(diff);
    this.track.style.transition = 'transform 0.3s ease';
  }

  updateTrackPosition(offset) {
    const currentPosition = -this.currentIndex * this.container.offsetWidth;
    this.track.style.transform = `translateX(${currentPosition + offset}px)`;
  }

  handleSwipe(diff) {
    const threshold = this.container.offsetWidth * 0.3;
    if (Math.abs(diff) > threshold) {
      diff > 0 ? this.prevSlide() : this.nextSlide();
    } else {
      this.goToSlide(this.currentIndex);
    }
  }

  updateIndicator() {
    const indicators = this.container.querySelectorAll('.indicator');
    indicators.forEach(indicator => indicator.classList.remove('active'));
    indicators[this.currentIndex].classList.add('active');
  }

  goToSlide(index) {
    if (index < 0) index = this.items.length - 1;
    if (index >= this.items.length) index = 0;

    this.currentIndex = index;
    this.track.style.transform = `translateX(-${index * 100}%)`;
    this.updateIndicator();
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  autoPlay(interval = 3000) {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), interval);

    // 鼠标悬停暂停
    this.container.addEventListener('mouseenter', () => clearInterval(this.autoPlayInterval));
    this.container.addEventListener('mouseleave', () => this.autoPlay(interval));
  }
}

