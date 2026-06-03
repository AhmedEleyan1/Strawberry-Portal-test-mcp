import React, { useState } from 'react';

export function CalendarPopover({ selectedDate, onSelect }) {
  // Determine initial month/year based on selectedDate
  const [currentDate, setCurrentDate] = useState(() => {
    if (selectedDate && selectedDate !== '–') {
      const parts = selectedDate.split('.');
      if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
    return new Date();
  });

  const selectedDateObj = selectedDate && selectedDate !== '–'
    ? (() => {
        const parts = selectedDate.split('.');
        if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]);
        return null;
      })()
    : null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const firstDayIndexRaw = new Date(year, month, 1).getDay();
  // We want Monday as index 0, convert Sunday (0) to 6 and subtract 1 from others:
  const firstDayIndex = firstDayIndexRaw === 0 ? 6 : firstDayIndexRaw - 1;

  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const cells = [];

  // Render 42 grid cells
  for (let i = 0; i < 42; i++) {
    if (i < firstDayIndex) {
      // Prev month cells
      cells.push({
        type: 'empty',
        text: prevMonthTotalDays - firstDayIndex + i + 1
      });
    } else if (i >= firstDayIndex + totalDays) {
      // Next month cells
      cells.push({
        type: 'empty',
        text: i - (firstDayIndex + totalDays) + 1
      });
    } else {
      const dayNumber = i - firstDayIndex + 1;
      const cellDate = new Date(year, month, dayNumber);
      
      const isSelected = selectedDateObj &&
        cellDate.getFullYear() === selectedDateObj.getFullYear() &&
        cellDate.getMonth() === selectedDateObj.getMonth() &&
        cellDate.getDate() === selectedDateObj.getDate();

      const today = new Date();
      const isToday = cellDate.getFullYear() === today.getFullYear() &&
        cellDate.getMonth() === today.getMonth() &&
        cellDate.getDate() === today.getDate();

      cells.push({
        type: 'day',
        text: dayNumber,
        isSelected,
        isToday,
        date: cellDate
      });
    }
  }

  return (
    <div className="calendar-popover" onClick={(e) => e.stopPropagation()}>
      <div className="calendar-header">
        <button type="button" className="calendar-nav-btn" onClick={handlePrevMonth} aria-label="Previous month">&lt;</button>
        <span className="calendar-month-year">{monthNames[month]} {year}</span>
        <button type="button" className="calendar-nav-btn" onClick={handleNextMonth} aria-label="Next month">&gt;</button>
      </div>
      <div className="calendar-weekdays">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
      <div className="calendar-days">
        {cells.map((cell, idx) => {
          if (cell.type === 'empty') {
            return (
              <div key={idx} className="calendar-day empty">{cell.text}</div>
            );
          }

          return (
            <div 
              key={idx}
              className={`calendar-day ${cell.isSelected ? 'selected' : ''} ${cell.isToday ? 'today' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                const dd = String(cell.text).padStart(2, '0');
                const mm = String(month + 1).padStart(2, '0');
                onSelect(`${dd}.${mm}.${year}`);
              }}
            >
              {cell.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
