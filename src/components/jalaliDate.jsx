import React from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian'; // Jalali calendar
import persian_fa_af from '../locales/persian_fa_af';
const JalaliDateInput = ({ value, onChange, width }) => {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      calendar={persian}
      locale={persian_fa_af} // Use Farsi Afghanistan locale
      format="YYYY/MM/DD" // Adjust format as needed
      calendarPosition="bottom-left"
      style={{ height: '2rem', width: width, cursor: 'pointer' }}
    />
  );
};

export default JalaliDateInput;
