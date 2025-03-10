import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('button[data-start]');
startButton.disabled = true;

const dateTimePicker = document.getElementById('datetime-picker');
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(dateTimePicker, options);

const daysDisplay = document.querySelector('[data-days]');
const hoursDisplay = document.querySelector('[data-hours]');
const minutesDisplay = document.querySelector('[data-minutes]');
const secondsDisplay = document.querySelector('[data-seconds]');

let intervalId;

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  intervalId = setInterval(() => {
    const now = new Date();
    const timeLeft = userSelectedDate - now;
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished',
      });
      dateTimePicker.disabled = false;
    } else {
      const { days, hours, minutes, seconds } = convertMs(timeLeft);
      daysDisplay.textContent = addLeadingZero(days);
      hoursDisplay.textContent = addLeadingZero(hours);
      minutesDisplay.textContent = addLeadingZero(minutes);
      secondsDisplay.textContent = addLeadingZero(seconds);
    }
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
