import React, { useState, useRef, useEffect, useMemo } from 'react';
import './BatchFolio.css';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import { Input, Button, Table, Pagination, Select, Tooltip, Drawer, Form, DatePicker, Checkbox, Dropdown, Modal, message, Spin, Switch } from 'antd';
import { SearchOutlined, CloseOutlined, MenuOutlined, FlagOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { ReactComponent as ColumnsIcon } from '../assets/Icons/ColumnsIcon.svg';
import { ReactComponent as FunnelIcon } from '../assets/Icons/FunnelIcon.svg';
import { ReactComponent as CancelledIcon } from '../assets/Icons/Cancelled.svg';
import { ReactComponent as CheckedOutIcon } from '../assets/Icons/checked-out.svg';
import { ReactComponent as ConfirmedIcon } from '../assets/Icons/confirmed.svg';
import { ReactComponent as InHouseIcon } from '../assets/Icons/in-house.svg';
import { ReactComponent as NoShowIcon } from '../assets/Icons/no-show.svg';
import { ReactComponent as UnconfirmedIcon } from '../assets/Icons/unconfirmed.svg';
import { ReactComponent as TransferOutIcon } from '../assets/Icons/transfer out.svg';
import { ReactComponent as GroupIcon } from '../assets/Icons/GroupIcon.svg';
import { ReactComponent as ExportIcon } from '../assets/Icons/export.svg';
import { ReactComponent as EraserIcon } from '../assets/Icons/eraser.svg';
import { ReactComponent as GripDotsVerticalIcon } from '../assets/Icons/grip-dots-vertical.svg';
import { ReactComponent as InfoIcon } from '../assets/Icons/info icon.svg';
import { ReactComponent as BanIcon } from '../assets/Icons/Ban.svg';
import dayjs from 'dayjs';
import update from 'immutability-helper';
import ResponsiveMultiSelect from '../components/ResponsiveMultiSelect';
import { Menu } from 'antd';
import FolioImg from '../assets/Images/Folio.png';
import DetailedFolioImg from '../assets/Images/Detailed folio.png';
import RegistrationFormImg from '../assets/Images/Registration Form.png';
import ExportSuccessAlert from '../components/ExportSuccessAlert';

const BUILDINGS = ['Building A', 'Building B', 'Building C'];
const FLOORS = ['Floor 1', 'Floor 2', 'Floor 3'];
const roomTypes = ['Deluxe', 'Suite', 'Standard', 'Executive', 'Superior'];
const roomTypeShortMap: Record<string, string> = {
  'Deluxe': 'DLX',
  'Suite': 'STE',
  'Standard': 'STD',
  'Executive': 'EXE',
  'Superior': 'SUP',
};
const businessSources = ['ASI WebRes', 'Walk-In', 'Mobile', 'Google Hotel Booking', 'Expedia', 'Hotels.com', 'Hotwire', 'SynXis Web', 'Booking.com', 'Travelocity (GHE)', 'Agoda', 'Ctrip', 'Travlu'];
const cancellationPolicies = ['Flexible', 'Non-refundable'];

const peopleNames = [
  'Olivia Smith', 'Liam Johnson', 'Emma Williams', 'Noah Brown', 'Ava Jones',
  'Sophia Garcia', 'Mason Miller', 'Isabella Davis', 'Lucas Rodriguez', 'Mia Martinez',
  'Charlotte Hernandez', 'Amelia Lopez', 'Elijah Gonzalez', 'Harper Wilson', 'Benjamin Anderson',
  'Evelyn Thomas', 'James Taylor', 'Abigail Moore', 'Henry Jackson', 'Emily Martin',
  'Alexander Lee', 'Elizabeth Perez', 'Sebastian Thompson', 'Ella White', 'Jack Harris',
  'Scarlett Clark', 'Daniel Lewis', 'Grace Robinson', 'Matthew Walker', 'Chloe Young',
  'David Allen', 'Penelope King', 'Joseph Wright', 'Layla Scott', 'Samuel Green',
  'Victoria Adams', 'Carter Baker', 'Lily Nelson', 'Owen Hill', 'Hannah Ramirez',
  'Wyatt Campbell', 'Aria Mitchell', 'John Carter', 'Sofia Roberts', 'Julian Evans',
  'Zoe Turner', 'Levi Phillips', 'Nora Parker', 'Isaac Collins', 'Riley Edwards'
];

const RESERVATION_STATUS_VALUES = [
  'Unconfirmed',
  'Confirmed',
  'Checked-Out',
  'In-House',
];

const STATUS_PRIORITY: Record<string, number> = {
  'In-House': 1,
  'Confirmed': 2,
  'Unconfirmed': 3,
  'Checked-Out': 4,
};

// Custom sort orders for reservationStatus
const STATUS_SORT_ORDERS = {
  ascend: ['Checked-Out', 'Confirmed', 'In-House', 'Unconfirmed'],
  descend: ['Unconfirmed', 'In-House', 'Confirmed', 'Checked-Out'],
};

// Helper to generate a reservation ID in the format 'R' + 6-digit number
const formatReservationId = (num: number) => `R${String(num).padStart(6, '0')}`;

const generateData = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const idx = i + 1;
    const roomType = roomTypes[idx % roomTypes.length];
    return {
      key: String(idx),
      reservationId: formatReservationId(123000 + idx),
      pocFullName: peopleNames[(idx - 1) % peopleNames.length],
      checkInDate: `2024-06-${(idx % 28 + 1).toString().padStart(2, '0')}`,
      checkOutDate: `2024-06-${((idx + 2) % 28 + 1).toString().padStart(2, '0')}`,
      room: `${100 + (idx % 10)} (${roomTypeShortMap[roomType]})`,
      cancellationPolicy: cancellationPolicies[idx % cancellationPolicies.length],
      businessSource: businessSources[idx % businessSources.length],
      totalCharges: 800 + (idx * 37) % 2000,
      balance: (idx * 53) % 700,
      reservationStatus: RESERVATION_STATUS_VALUES[Math.floor(Math.random() * RESERVATION_STATUS_VALUES.length)],
    };
  });

// For group children, assign real names as well
const groupChildName = (i: number) => peopleNames[i % peopleNames.length];

// Generate 10 rows for each status
const today = dayjs();
const demoStatusRows: Record<string, any>[] = [];
const baseNumbers = {
  unconfirmed: 100010,
  confirmed: 100020,
  inhouse: 100030,
  checkedout: 100040,
};
for (let i = 0; i < 10; i++) {
  // Unconfirmed: check-in > 7 days from today
  demoStatusRows.push({
    key: `demo-unconfirmed-${i}`,
    reservationId: formatReservationId(baseNumbers.unconfirmed - i),
    pocFullName: peopleNames[i % peopleNames.length],
    checkInDate: today.add(8 + i, 'day').format('YYYY-MM-DD'),
    checkOutDate: today.add(10 + i, 'day').format('YYYY-MM-DD'),
    room: `${201 + i} (${roomTypeShortMap[roomTypes[i % roomTypes.length]]})`,
    cancellationPolicy: cancellationPolicies[i % cancellationPolicies.length],
    businessSource: businessSources[i % businessSources.length],
    totalCharges: 1000 + i * 50,
    balance: 200 + i * 10,
  });
  // Confirmed: check-in within 7 days from today
  if (i % 3 === 2) {
    // Space reservation
    demoStatusRows.push({
      key: `demo-confirmed-space-${i}`,
      reservationId: formatReservationId(baseNumbers.confirmed - i),
      pocFullName: peopleNames[(i+10) % peopleNames.length],
      checkInDate: today.add(i, 'day').format('YYYY-MM-DD'),
      checkOutDate: today.add(i+2, 'day').format('YYYY-MM-DD'),
      space: i % 2 === 0 ? 'Conference Room' : 'Swimming Pool',
      spaceType: i % 2 === 0 ? 'Event & Meeting Spaces' : 'Recreation & Wellness',
      cancellationPolicy: cancellationPolicies[(i+1) % cancellationPolicies.length],
      businessSource: businessSources[(i+1) % businessSources.length],
      totalCharges: 1200 + i * 60,
      balance: 150 + i * 12,
    });
  } else if (i % 4 === 3) {
    // Group reservation (multiple rooms)
    demoStatusRows.push({
      key: `demo-confirmed-group-${i}`,
      reservationId: formatReservationId(baseNumbers.confirmed - i),
      pocFullName: `Group Confirmed ${i+1}`,
      checkInDate: today.add(i, 'day').format('YYYY-MM-DD'),
      checkOutDate: today.add(i+2, 'day').format('YYYY-MM-DD'),
      room: `Multiple (${roomTypeShortMap[roomTypes[(i+1) % roomTypes.length]]})`,
      cancellationPolicy: cancellationPolicies[(i+1) % cancellationPolicies.length],
      businessSource: businessSources[(i+1) % businessSources.length],
      totalCharges: 2400 + i * 120,
      balance: 300 + i * 24,
      children: [
        {
          key: `demo-confirmed-group-${i}-c1`,
          reservationId: formatReservationId(baseNumbers.confirmed - i - 100),
          pocFullName: peopleNames[(i+11) % peopleNames.length],
          checkInDate: today.add(i, 'day').format('YYYY-MM-DD'),
          checkOutDate: today.add(i+2, 'day').format('YYYY-MM-DD'),
          room: `${601 + i * 2} (${roomTypeShortMap[roomTypes[(i+1) % roomTypes.length]]})`,
          cancellationPolicy: cancellationPolicies[(i+1) % cancellationPolicies.length],
          businessSource: businessSources[(i+1) % businessSources.length],
          totalCharges: 1200 + i * 60,
          balance: 150 + i * 12,
        },
        {
          key: `demo-confirmed-group-${i}-c2`,
          reservationId: formatReservationId(baseNumbers.confirmed - i - 200),
          pocFullName: peopleNames[(i+12) % peopleNames.length],
          checkInDate: today.add(i, 'day').format('YYYY-MM-DD'),
          checkOutDate: today.add(i+2, 'day').format('YYYY-MM-DD'),
          room: `${602 + i * 2} (${roomTypeShortMap[roomTypes[(i+1) % roomTypes.length]]})`,
          cancellationPolicy: cancellationPolicies[(i+1) % cancellationPolicies.length],
          businessSource: businessSources[(i+1) % businessSources.length],
          totalCharges: 1200 + i * 60,
          balance: 150 + i * 12,
        },
      ],
    });
  } else {
    // Single room reservation
    demoStatusRows.push({
      key: `demo-confirmed-${i}`,
      reservationId: formatReservationId(baseNumbers.confirmed - i),
      pocFullName: peopleNames[(i+10) % peopleNames.length],
      checkInDate: today.add(i, 'day').format('YYYY-MM-DD'),
      checkOutDate: today.add(i+2, 'day').format('YYYY-MM-DD'),
      room: `${301 + i} (${roomTypeShortMap[roomTypes[(i+1) % roomTypes.length]]})`,
      cancellationPolicy: cancellationPolicies[(i+1) % cancellationPolicies.length],
      businessSource: businessSources[(i+1) % businessSources.length],
      totalCharges: 1200 + i * 60,
      balance: 150 + i * 12,
    });
  }
  // In-House: today is between check-in and check-out
  if (i % 3 === 2) {
    // Space reservation
    demoStatusRows.push({
      key: `demo-inhouse-space-${i}`,
      reservationId: formatReservationId(baseNumbers.inhouse - i),
      pocFullName: peopleNames[(i+20) % peopleNames.length],
      checkInDate: today.subtract(1 + i, 'day').format('YYYY-MM-DD'),
      checkOutDate: today.add(1 + i, 'day').format('YYYY-MM-DD'),
      space: i % 2 === 0 ? 'Conference Room' : 'Swimming Pool',
      spaceType: i % 2 === 0 ? 'Event & Meeting Spaces' : 'Recreation & Wellness',
      cancellationPolicy: cancellationPolicies[(i+2) % cancellationPolicies.length],
      businessSource: businessSources[(i+2) % businessSources.length],
      totalCharges: 1400 + i * 70,
      balance: 100 + i * 14,
    });
  } else if (i % 4 === 3) {
    // Group reservation (multiple rooms)
    demoStatusRows.push({
      key: `demo-inhouse-group-${i}`,
      reservationId: formatReservationId(baseNumbers.inhouse - i),
      pocFullName: `Group In-House ${i+1}`,
      checkInDate: today.subtract(1 + i, 'day').format('YYYY-MM-DD'),
      checkOutDate: today.add(1 + i, 'day').format('YYYY-MM-DD'),
      room: `Multiple (${roomTypeShortMap[roomTypes[(i+2) % roomTypes.length]]})`,
      cancellationPolicy: cancellationPolicies[(i+2) % cancellationPolicies.length],
      businessSource: businessSources[(i+2) % businessSources.length],
      totalCharges: 2800 + i * 140,
      balance: 200 + i * 28,
      children: [
        {
          key: `demo-inhouse-group-${i}-c1`,
          reservationId: formatReservationId(baseNumbers.inhouse - i - 100),
          pocFullName: peopleNames[(i+21) % peopleNames.length],
          checkInDate: today.subtract(1 + i, 'day').format('YYYY-MM-DD'),
          checkOutDate: today.add(1 + i, 'day').format('YYYY-MM-DD'),
          room: `${701 + i * 2} (${roomTypeShortMap[roomTypes[(i+2) % roomTypes.length]]})`,
          cancellationPolicy: cancellationPolicies[(i+2) % cancellationPolicies.length],
          businessSource: businessSources[(i+2) % businessSources.length],
          totalCharges: 1400 + i * 70,
          balance: 100 + i * 14,
        },
        {
          key: `demo-inhouse-group-${i}-c2`,
          reservationId: formatReservationId(baseNumbers.inhouse - i - 200),
          pocFullName: peopleNames[(i+22) % peopleNames.length],
          checkInDate: today.subtract(1 + i, 'day').format('YYYY-MM-DD'),
          checkOutDate: today.add(1 + i, 'day').format('YYYY-MM-DD'),
          room: `${702 + i * 2} (${roomTypeShortMap[roomTypes[(i+2) % roomTypes.length]]})`,
          cancellationPolicy: cancellationPolicies[(i+2) % cancellationPolicies.length],
          businessSource: businessSources[(i+2) % businessSources.length],
          totalCharges: 1400 + i * 70,
          balance: 100 + i * 14,
        },
      ],
    });
  } else {
    // Single room reservation
    demoStatusRows.push({
      key: `demo-inhouse-${i}`,
      reservationId: formatReservationId(baseNumbers.inhouse - i),
      pocFullName: peopleNames[(i+20) % peopleNames.length],
      checkInDate: today.subtract(1 + i, 'day').format('YYYY-MM-DD'),
      checkOutDate: today.add(1 + i, 'day').format('YYYY-MM-DD'),
      room: `${401 + i} (${roomTypeShortMap[roomTypes[(i+2) % roomTypes.length]]})`,
      cancellationPolicy: cancellationPolicies[(i+2) % cancellationPolicies.length],
      businessSource: businessSources[(i+2) % businessSources.length],
      totalCharges: 1400 + i * 70,
      balance: 100 + i * 14,
    });
  }
  // Checked-Out: check-out is today
  demoStatusRows.push({
    key: `demo-checkedout-${i}`,
    reservationId: formatReservationId(baseNumbers.checkedout - i),
    pocFullName: peopleNames[(i+30) % peopleNames.length],
    checkInDate: today.subtract(2 + i, 'day').format('YYYY-MM-DD'),
    checkOutDate: today.format('YYYY-MM-DD'),
    room: `${501 + i} (${roomTypeShortMap[roomTypes[(i+3) % roomTypes.length]]})`,
    cancellationPolicy: cancellationPolicies[(i+3) % cancellationPolicies.length],
    businessSource: businessSources[(i+3) % businessSources.length],
    totalCharges: 1600 + i * 80,
    balance: 50 + i * 16,
  });
}

function assignBuildingFloorRoomType(row: any, idx: number) {
  // Extract roomType from room string if present
  let roomType = undefined;
  if (row.room) {
    const match = row.room.match(/\(([^)]+)\)/);
    if (match) {
      const short = match[1];
      roomType = Object.keys(roomTypeShortMap).find(key => roomTypeShortMap[key] === short) || short;
    }
  }
  return {
    ...row,
    building: row.building || BUILDINGS[idx % BUILDINGS.length],
    floor: row.floor || FLOORS[idx % FLOORS.length],
    roomType: row.roomType || roomType,
  };
}

// Insert negative balance demo rows at random positions in allDataNested
const negativeBalanceRows = [
  {
    key: 'neg-balance-1',
    reservationId: formatReservationId(90010),
    pocFullName: 'Negative Balance 1',
    checkInDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(4, 'day').format('YYYY-MM-DD'),
    room: '401 (DLX)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1200,
    balance: -50,
  },
  {
    key: 'neg-balance-2',
    reservationId: formatReservationId(90011),
    pocFullName: 'Negative Balance 2',
    checkInDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    room: '402 (STD)',
    cancellationPolicy: 'Non-refundable',
    businessSource: 'Expedia',
    totalCharges: 900,
    balance: -120.75,
  },
  {
    key: 'neg-balance-3',
    reservationId: formatReservationId(90012),
    pocFullName: 'Negative Balance 3',
    checkInDate: dayjs().add(4, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(6, 'day').format('YYYY-MM-DD'),
    room: '403 (STE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Agoda',
    totalCharges: 1500,
    balance: -5.5,
  },
];

// Now define allDataNested, uniqueData, etc.
const allDataNested: Record<string, any>[] = [
  ...demoStatusRows,
  ...generateData(5),
  // Demo rows for today
  {
    key: 'demo-unconfirmed',
    reservationId: formatReservationId(9001),
    pocFullName: 'Demo Unconfirmed',
    checkInDate: dayjs().add(10, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(12, 'day').format('YYYY-MM-DD'),
    room: '701 (DLX)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1200,
    balance: 200,
  },
  {
    key: 'demo-confirmed',
    reservationId: formatReservationId(9002),
    pocFullName: 'Demo Confirmed',
    checkInDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    room: '702 (STD)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 900,
    balance: 100,
  },
  {
    key: 'demo-inhouse',
    reservationId: formatReservationId(9003),
    pocFullName: 'Demo In-House',
    checkInDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    room: '703 (STE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 5000,
    balance: 0,
  },
  {
    key: 'demo-checkedout',
    reservationId: formatReservationId(9004),
    pocFullName: 'Demo Checked-Out',
    checkInDate: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().format('YYYY-MM-DD'),
    room: '704 (EXE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1500,
    balance: 0,
  },
  // Demo rows for 2025 (set today to 2025-01-12 to see all statuses)
  {
    key: '2025-unconfirmed',
    reservationId: formatReservationId(20251001),
    pocFullName: '2025 Unconfirmed',
    checkInDate: '2025-01-25',
    checkOutDate: '2025-01-28',
    room: '801 (DLX)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1200,
    balance: 200,
  },
  {
    key: '2025-confirmed',
    reservationId: formatReservationId(20251002),
    pocFullName: '2025 Confirmed',
    checkInDate: '2025-01-15',
    checkOutDate: '2025-01-18',
    room: '802 (STD)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 900,
    balance: 100,
  },
  {
    key: '2025-inhouse',
    reservationId: formatReservationId(20251003),
    pocFullName: '2025 In-House',
    checkInDate: '2025-01-10',
    checkOutDate: '2025-01-14',
    room: '803 (STE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 5000,
    balance: 0,
  },
  {
    key: '2025-checkedout',
    reservationId: formatReservationId(20251004),
    pocFullName: '2025 Checked-Out',
    checkInDate: '2025-01-05',
    checkOutDate: '2025-01-12',
    room: '804 (EXE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1500,
    balance: 0,
  },
  // Demo rows for 2025 to cover all 4 statuses
  {
    key: 'future-unconfirmed',
    reservationId: formatReservationId(202501),
    pocFullName: 'Future Unconfirmed',
    checkInDate: '2025-12-20',
    checkOutDate: '2025-12-25',
    room: '601 (DLX)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1200,
    balance: 200,
  },
  {
    key: 'future-confirmed',
    reservationId: formatReservationId(202502),
    pocFullName: 'Future Confirmed',
    checkInDate: '2025-01-10',
    checkOutDate: '2025-01-15',
    room: '602 (STD)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 900,
    balance: 100,
  },
  {
    key: 'future-inhouse',
    reservationId: formatReservationId(202503),
    pocFullName: 'Future In-House',
    checkInDate: '2025-01-01',
    checkOutDate: '2025-12-31',
    room: '603 (STE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 5000,
    balance: 0,
  },
  {
    key: 'future-checkedout',
    reservationId: formatReservationId(202504),
    pocFullName: 'Future Checked-Out',
    checkInDate: '2025-01-01',
    checkOutDate: '2025-01-15',
    room: '604 (EXE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1500,
    balance: 0,
  },
  {
    key: 'parent-1',
    reservationId: formatReservationId(123036),
    pocFullName: 'Standard Group',
    checkInDate: '2024-06-10',
    checkOutDate: '2024-06-15',
    room: `Multiple (${roomTypeShortMap['Standard']})`,
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 5600,
    balance: 800,
    children: [
      { key: 'p1-c1', reservationId: formatReservationId(123037), pocFullName: groupChildName(0), checkInDate: '2024-06-10', checkOutDate: '2024-06-15', room: `301 (${roomTypeShortMap['Standard']})`, cancellationPolicy: 'Flexible', businessSource: 'Direct', totalCharges: 1120, balance: 160 },
      { key: 'p1-c2', reservationId: formatReservationId(123038), pocFullName: groupChildName(1), checkInDate: '2024-06-10', checkOutDate: '2024-06-15', room: `302 (${roomTypeShortMap['Standard']})`, cancellationPolicy: 'Flexible', businessSource: 'Direct', totalCharges: 1120, balance: 160 },
    ],
  },
  {
    key: 'parent-2',
    reservationId: formatReservationId(123039),
    pocFullName: 'Deluxe Group',
    checkInDate: '2024-06-16',
    checkOutDate: '2024-06-20',
    room: `Multiple (${roomTypeShortMap['Deluxe']})`,
    cancellationPolicy: 'Non-refundable',
    businessSource: 'Expedia',
    totalCharges: 7200,
    balance: 1200,
    children: [
      { key: 'p2-c1', reservationId: formatReservationId(123040), pocFullName: groupChildName(2), checkInDate: '2024-06-16', checkOutDate: '2024-06-20', room: `401 (${roomTypeShortMap['Deluxe']})`, cancellationPolicy: 'Non-refundable', businessSource: 'Expedia', totalCharges: 1800, balance: 300 },
      { key: 'p2-c2', reservationId: formatReservationId(123041), pocFullName: groupChildName(3), checkInDate: '2024-06-16', checkOutDate: '2024-06-20', room: `402 (${roomTypeShortMap['Deluxe']})`, cancellationPolicy: 'Non-refundable', businessSource: 'Expedia', totalCharges: 1800, balance: 300 },
      { key: 'p2-c3', reservationId: formatReservationId(123042), pocFullName: groupChildName(4), checkInDate: '2024-06-16', checkOutDate: '2024-06-20', room: `403 (${roomTypeShortMap['Deluxe']})`, cancellationPolicy: 'Non-refundable', businessSource: 'Expedia', totalCharges: 1800, balance: 300 },
    ],
  },
  {
    key: 'parent-3',
    reservationId: formatReservationId(123043),
    pocFullName: 'Suite Group',
    checkInDate: '2024-06-21',
    checkOutDate: '2024-06-25',
    room: `Multiple (${roomTypeShortMap['Suite']})`,
    cancellationPolicy: 'Flexible',
    businessSource: 'Agoda',
    totalCharges: 9000,
    balance: 1500,
    children: [
      { key: 'p3-c1', reservationId: formatReservationId(123044), pocFullName: groupChildName(5), checkInDate: '2024-06-21', checkOutDate: '2024-06-25', room: `501 (${roomTypeShortMap['Suite']})`, cancellationPolicy: 'Flexible', businessSource: 'Agoda', totalCharges: 2250, balance: 375 },
      { key: 'p3-c2', reservationId: formatReservationId(123045), pocFullName: groupChildName(6), checkInDate: '2024-06-21', checkOutDate: '2024-06-25', room: `502 (${roomTypeShortMap['Suite']})`, cancellationPolicy: 'Flexible', businessSource: 'Agoda', totalCharges: 2250, balance: 375 },
    ],
  },
  // Add a few standalone space reservations
  {
    key: 'space-1',
    reservationId: formatReservationId(1001),
    pocFullName: 'Event Booker',
    checkInDate: '2024-06-18',
    checkOutDate: '2024-06-18',
    space: 'Conference Room',
    spaceType: 'Event & Meeting Spaces',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 500,
    balance: 0,
  },
  {
    key: 'space-2',
    reservationId: formatReservationId(1002),
    pocFullName: 'Wellness Guest',
    checkInDate: '2024-06-19',
    checkOutDate: '2024-06-19',
    space: 'Swimming Pool',
    spaceType: 'Recreation & Wellness',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 200,
    balance: 0,
  },
  ...generateData(30).map(item => ({ ...item, key: `g${item.key}` })),
  // Add demo 'Individual (Linked to group)' rows
  {
    key: 'linked-1',
    reservationId: formatReservationId(80001),
    pocFullName: 'John Doe',
    checkInDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    room: '305 (DLX)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1100,
    balance: 100,
    groupName: 'Standard Group',
  },
  {
    key: 'linked-2',
    reservationId: formatReservationId(80002),
    pocFullName: 'Jane Smith',
    checkInDate: dayjs().add(4, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(6, 'day').format('YYYY-MM-DD'),
    room: '306 (STD)',
    cancellationPolicy: 'Non-refundable',
    businessSource: 'Expedia',
    totalCharges: 1200,
    balance: 200,
    groupName: 'Deluxe Group',
  },
  {
    key: 'linked-3',
    reservationId: formatReservationId(80003),
    pocFullName: 'Alex Lee',
    checkInDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    room: '307 (STE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Agoda',
    totalCharges: 1300,
    balance: 300,
    groupName: 'Suite Group',
  },
  // Add more demo 'Individual (Linked to group)' rows, some with Pending Revenue icon
  {
    key: 'linked-4',
    reservationId: formatReservationId(80004),
    pocFullName: 'Priya Patel',
    checkInDate: dayjs().add(6, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(8, 'day').format('YYYY-MM-DD'),
    room: '308 (DLX)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1400,
    balance: 0,
    groupName: 'Standard Group',
  },
  {
    key: 'linked-5',
    reservationId: formatReservationId(80005),
    pocFullName: 'Carlos Gomez',
    checkInDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(9, 'day').format('YYYY-MM-DD'),
    room: '309 (STD)',
    cancellationPolicy: 'Non-refundable',
    businessSource: 'Expedia',
    totalCharges: 1500,
    balance: 200, // Will show Pending Revenue icon
    groupName: 'Deluxe Group',
    reservationStatus: 'Checked-Out',
  },
  {
    key: 'linked-6',
    reservationId: formatReservationId(80006),
    pocFullName: 'Emily Chen',
    checkInDate: dayjs().add(8, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(10, 'day').format('YYYY-MM-DD'),
    room: '310 (STE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Agoda',
    totalCharges: 1600,
    balance: 300, // Will show Pending Revenue icon
    groupName: 'Suite Group',
    reservationStatus: 'In-House',
  },
  // Add more demo 'Individual (Linked to group)' rows for in-house guests
  {
    key: 'linked-7',
    reservationId: formatReservationId(80007),
    pocFullName: 'Sara Ahmed',
    checkInDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    room: '311 (DLX)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 1700,
    balance: 120, // Will show Pending Revenue icon
    groupName: 'Standard Group',
    reservationStatus: 'In-House',
  },
  {
    key: 'linked-8',
    reservationId: formatReservationId(80008),
    pocFullName: 'Liam O\'Brien',
    checkInDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    room: '312 (STD)',
    cancellationPolicy: 'Non-refundable',
    businessSource: 'Expedia',
    totalCharges: 1800,
    balance: 250, // Will show Pending Revenue icon
    groupName: 'Deluxe Group',
    reservationStatus: 'In-House',
  },
  {
    key: 'linked-9',
    reservationId: formatReservationId(80009),
    pocFullName: 'Mina Park',
    checkInDate: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    room: '313 (STE)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Agoda',
    totalCharges: 1900,
    balance: 300, // Will show Pending Revenue icon
    groupName: 'Suite Group',
    reservationStatus: 'In-House',
  },
  // Add demo 'Individual (Linked to group)' rows with long group names for truncation testing
  {
    key: 'linked-long-1',
    reservationId: formatReservationId(80010),
    pocFullName: 'Long Group Name 1',
    checkInDate: dayjs().add(9, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(11, 'day').format('YYYY-MM-DD'),
    room: '314 (DLX)',
    cancellationPolicy: 'Flexible',
    businessSource: 'Direct',
    totalCharges: 2000,
    balance: 0,
    groupName: 'The International Association of Very Distinguished and Exceptionally Long Group Names',
  },
  {
    key: 'linked-long-2',
    reservationId: formatReservationId(80011),
    pocFullName: 'Long Group Name 2',
    checkInDate: dayjs().add(10, 'day').format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(12, 'day').format('YYYY-MM-DD'),
    room: '315 (STD)',
    cancellationPolicy: 'Non-refundable',
    businessSource: 'Expedia',
    totalCharges: 2100,
    balance: 0,
    groupName: 'Annual Conference of the Society for the Promotion of Extremely Verbose Group Titles',
  },
];

// Insert at random positions (e.g., after 5th, 15th, and 25th rows)
allDataNested.splice(5, 0, negativeBalanceRows[0]);
allDataNested.splice(15, 0, negativeBalanceRows[1]);
allDataNested.splice(25, 0, negativeBalanceRows[2]);

const uniqueData: Record<string, any>[] = [];
const seenReservationIds = new Set();
const allowedBusinessSources = new Set(businessSources);
allDataNested.forEach((row, idx) => {
  let processedRow = assignBuildingFloorRoomType(row, idx);
  if (!allowedBusinessSources.has(processedRow.businessSource)) {
    processedRow.businessSource = businessSources[0];
  }
  if (!seenReservationIds.has(processedRow.reservationId)) {
    uniqueData.push(processedRow);
    seenReservationIds.add(processedRow.reservationId);
  }
});
// Use uniqueData instead of allDataNested for table and filtering

function flattenData(data: any[]): any[] {
  const result: any[] = [];
  data.forEach(row => {
    const { children, ...parentData } = row;
    result.push({ ...parentData, isParent: !!children, isChild: false });
    if (children) {
      children.forEach((child: any) => {
        result.push({ ...child, isParent: false, isChild: true });
      });
    }
  });
  return result;
}

const flatAllData = flattenData(uniqueData);

const pageSizeOptions = [5, 10, 20, 30, 50];

// Robust date formatter for 'YYYY-MM-DD' to 'MMM DD, YYYY'
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

// Add this component above BatchFolio
const TruncateTooltipCell: React.FC<{ value: string }> = ({ value }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [value]);

  const cell = (
    <span
      ref={spanRef}
      className="table-cell-ellipsis"
      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: 180 }}
    >
      {value}
    </span>
  );
  return isTruncated ? (
    <Tooltip title={value} placement="top">
      {cell}
    </Tooltip>
  ) : cell;
};

// Add this component above BatchFolio
const TruncateTooltipCellIfTruncated: React.FC<{ value: string; maxWidth?: number }> = ({ value, maxWidth = 120 }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [value, maxWidth]);

  const cell = (
    <span
      ref={spanRef}
      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth }}
    >
      {value}
    </span>
  );
  return isTruncated ? (
    <Tooltip title={value} placement="top">
      {cell}
    </Tooltip>
  ) : cell;
};

const RESERVATION_STATUSES = [
  { value: 'Unconfirmed', label: 'Unconfirmed', color: '#F5F5F5', borderColor: '#D9D9D9', textColor: '#222', icon: <span style={{marginRight: 8}}>👤⏰</span> },
  { value: 'Confirmed', label: 'Confirmed', color: '#E9FBEA', borderColor: '#A6E9B6', textColor: '#22543D', icon: <span style={{marginRight: 8}}>✔️</span> },
  { value: 'Checked-Out', label: 'Checked-Out', color: '#F3F6FD', borderColor: '#BFD7F5', textColor: '#2C3A7B', icon: <span style={{marginRight: 8}}>🔄</span> },
  { value: 'In-House', label: 'In-House', color: '#E6F8FA', borderColor: '#B6E9F5', textColor: '#22607B', icon: <span style={{marginRight: 8}}>🏠</span> },
];
const BUSINESS_SOURCES = ['ASI WebRes', 'Walk-In', 'Mobile', 'Google Hotel Booking', 'Expedia', 'Hotels.com', 'Hotwire', 'SynXis Web', 'Booking.com', 'Travelocity (GHE)', 'Agoda', 'Ctrip', 'Travlu'];


// Helper to get unique room types from data
const getRoomTypes = (data: any[]) => Array.from(new Set(data.map(d => d.roomType)));

// Helper to extract full room type names from the table data
const getFullRoomTypes = (data: any[]) => {
  const fullTypes = new Set<string>();
  data.forEach(row => {
    // Room is like '101 (STD)' or 'Multiple (STD)'
    const match = row.room && row.room.match(/\(([^)]+)\)/);
    if (match) {
      const short = match[1];
      // Find the full name from the short code
      const full = Object.keys(roomTypeShortMap).find(key => roomTypeShortMap[key] === short);
      if (full) fullTypes.add(full);
    }
  });
  return Array.from(fullTypes);
};

// Add this component above BatchFolio
const statusTagConfig: Record<string, { bg: string; border: string; color: string; icon: React.ReactNode }> = {
  'In-House': {
    bg: '#EDFDFD', border: '#9DECF9', color: '#086F83',
    icon: <InHouseIcon width={14} height={14} style={{ color: '#086F83' }} />
  },
  Cancelled: {
    bg: '#FFF5F5', border: '#FEB2B2', color: '#822727',
    icon: <CancelledIcon width={14} height={14} style={{ color: '#822727' }} />
  },
  'Transfer Out': {
    bg: '#FFFAF0', border: '#FBD38D', color: '#7B341E',
    icon: <span style={{ display: 'flex', alignItems: 'center', width: 14, height: 14 }}><TransferOutIcon width={14} height={14} style={{ color: '#7B341E' }} /></span>
  },
  'No Show': {
    bg: '#FFFFF0', border: '#FAF089', color: '#744210',
    icon: <NoShowIcon width={14} height={14} style={{ color: '#744210' }} />
  },
  'Checked-Out': {
    bg: '#F1F6FF', border: '#ACC4FD', color: '#333D73',
    icon: <CheckedOutIcon width={14} height={14} style={{ color: '#333D73' }} />
  },
  Unconfirmed: {
    bg: 'rgba(0,0,0,0.02)', border: '#D9D9D9', color: 'rgba(0,0,0,0.88)',
    icon: <UnconfirmedIcon width={14} height={14} style={{ color: 'rgba(0,0,0,0.88)' }} />
  },
  Confirmed: {
    bg: '#F0FFF4', border: '#9AE6B4', color: '#22543D',
    icon: <ConfirmedIcon width={14} height={14} style={{ color: '#22543D' }} />
  },
};

// Normalization function for status keys
const normalizeStatus = (status: string) => {
  if (!status) return 'Unconfirmed';
  const map: Record<string, string> = {
    unconfirmed: 'Unconfirmed',
    confirmed: 'Confirmed',
    'transfer out': 'Transfer Out',
    cancelled: 'Cancelled',
    'no show': 'No Show',
    'checked-out': 'Checked-Out',
    'checked out': 'Checked-Out',
    'in-house': 'In-House',
    'in house': 'In-House',
  };
  const key = status.trim().toLowerCase();
  return map[key] || 'Unconfirmed';
};

const ReservationStatusTag: React.FC<{ status: string }> = ({ status }) => {
  const config = statusTagConfig[normalizeStatus(status)] || statusTagConfig['Unconfirmed'];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: config.bg,
      border: `1px solid ${config.border}`,
      color: config.color,
      fontWeight: 500,
      fontSize: 12,
      lineHeight: '16px',
      borderRadius: 4,
      padding: '4px 8px',
      userSelect: 'none',
      minWidth: 0,
      maxWidth: 120,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', flex: 'none', fontSize: 14, width: 14, height: 14 }}>{config.icon}</span>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline' }}>{normalizeStatus(status)}</span>
    </span>
  );
};

const MANDATORY_COLUMNS = [
  { key: 'reservationId', label: 'Reservation ID' },
  { key: 'pocFullName', label: 'Point of Contact' },
];
const CUSTOMIZABLE_COLUMNS = [
  { key: 'checkInDate', label: 'Check-In Date' },
  { key: 'checkOutDate', label: 'Check-Out Date' },
  { key: 'room', label: 'Rooms/Spaces' },
  { key: 'reservationStatus', label: 'Status' },
  { key: 'cancellationPolicy', label: 'Cancellation Policy' },
  { key: 'businessSource', label: 'Business Source' },
  { key: 'totalCharges', label: 'Total Charges ($)' },
  { key: 'balance', label: 'Balance ($)' },
];

// Helper to get today's date in YYYY-MM-DD format
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const todayString = getTodayString();

// Helper to compute status based on business logic
function computeStatus(row: any, today: dayjs.Dayjs): string {
  const checkIn = dayjs(row.checkInDate);
  const checkOut = dayjs(row.checkOutDate);
  if (checkOut.isSame(today, 'day')) return 'Checked-Out';
  if ((today.isAfter(checkIn, 'day') || today.isSame(checkIn, 'day')) && today.isBefore(checkOut, 'day')) return 'In-House';
  if (checkIn.diff(today, 'day') > 7) return 'Unconfirmed';
  if (checkIn.diff(today, 'day') <= 7 && checkIn.diff(today, 'day') >= 0) return 'Confirmed';
  // fallback
  return 'Unconfirmed';
}
const todayDayjs = dayjs(todayString);

// Add this above BatchFolio
const POCCellWithTooltip: React.FC<{ displayName: string; email: string; showBan: boolean }> = ({ displayName, email, showBan }) => {
  const nameRef = React.useRef<HTMLSpanElement>(null);
  const emailRef = React.useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    if (nameRef.current && emailRef.current) {
      const nameTruncated = nameRef.current.scrollWidth > nameRef.current.clientWidth;
      const emailTruncated = emailRef.current.scrollWidth > emailRef.current.clientWidth;
      setShowTooltip(nameTruncated || emailTruncated);
    }
  }, [displayName, email]);

  const content = (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
        {showBan && (
          <span style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
            <BanIcon style={{ width: 16, height: 16, color: '#E53E3E' }} />
          </span>
        )}
        <span ref={nameRef} style={{ fontSize: 14, color: '#222', fontWeight: 400, lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', height: 20 }}>{displayName}</span>
      </div>
      <span ref={emailRef} style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', lineHeight: '20px', margin: '2px 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'block' }}>{email}</span>
    </>
  );

  return showTooltip ? (
    <Tooltip title={<span>{displayName}<br />{email}</span>} placement="top" overlayInnerStyle={{ maxWidth: 300 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 0, overflow: 'hidden', position: 'relative' }}>{content}</div>
    </Tooltip>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 0, overflow: 'hidden', position: 'relative' }}>{content}</div>
  );
};

// Add this above BatchFolio
const GroupInfoWithTooltip: React.FC<{ groupName: string }> = ({ groupName }) => {
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = React.useState(false);
  React.useEffect(() => {
    if (spanRef.current) {
      setShowTooltip(spanRef.current.scrollWidth > spanRef.current.clientWidth);
    }
  }, [groupName]);
  const display = `Indiv. Res | Group: ${groupName || 'N/A'}`;
  const tooltip = `Individual Reservation | Group: ${groupName || 'N/A'}`;
  const span = (
    <span
      ref={spanRef}
      style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', lineHeight: '20px', margin: '2px 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', maxWidth: '100%', display: 'block' }}
    >
      {display}
    </span>
  );
  return showTooltip ? (
    <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <Tooltip title={tooltip} placement="top">
        {span}
      </Tooltip>
    </div>
  ) : (
    <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>{span}</div>
  );
};

const BatchFolio: React.FC = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    reservationStatus: [] as string[],
    buildings: [] as string[],
    floors: [] as string[],
    businessSources: [] as string[],
    roomTypes: [] as string[],
    groups: [] as string[],
    cancellationPolicy: [] as string[],
  });
  const [pendingFilters, setPendingFilters] = useState(filters);
  const [customColumns, setCustomColumns] = useState(
    CUSTOMIZABLE_COLUMNS.map(col => ({ ...col, visible: true }))
  );
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [sorter, setSorter] = useState<{ columnKey?: string; order?: 'ascend' | 'descend' }>({});
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const printerOptions = [
    { value: 'printer1', label: 'Office Printer 1' },
    { value: 'printer2', label: 'Office Printer 2' },
    { value: 'printer3', label: 'PDF Printer' },
  ];

  // Helper to extract the numeric part of reservationId for sorting
  const extractReservationNumber = (reservationId: string) => {
    if (!reservationId) return 0;
    const match = reservationId.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrent(1); // Reset to first page on new search
  };

  const [showCheckedOut, setShowCheckedOut] = useState(true);

  const getSortedData = () => {
    let data = flatAllData;

    if (searchText.trim()) {
      const lower = searchText.trim().toLowerCase();
      data = data.filter(row =>
        (row.reservationId && String(row.reservationId).toLowerCase().includes(lower)) ||
        (row.pocFullName && String(row.pocFullName).toLowerCase().includes(lower))
      );
    }

    // Filter out Checked-Out reservations if switch is off
    if (!showCheckedOut) {
      data = data.filter(row => normalizeStatus(computeStatus(row, todayDayjs)) !== 'Checked-Out');
    }

    // Filtering logic (same as before)
    data = data.filter(row => {
      const computedStatus = computeStatus(row, todayDayjs);
      if (filters.dateRange) {
        const [start, end] = filters.dateRange;
        const checkIn = dayjs(row.checkInDate);
        if (checkIn.isBefore(start, 'day') || checkIn.isAfter(end, 'day')) return false;
      }
      if (filters.reservationStatus.length) {
        if (!filters.reservationStatus.includes(computedStatus)) return false;
      }
      if (filters.buildings.length && !filters.buildings.includes(row.building)) return false;
      if (filters.floors.length && !filters.floors.includes(row.floor)) return false;
      if (filters.businessSources.length && !filters.businessSources.includes(row.businessSource)) return false;
      if (filters.roomTypes.length && !filters.roomTypes.includes(row.roomType)) return false;
      if (filters.groups.length) {
        if (!(filters.groups.includes(row.groupName) || (row.isParent && filters.groups.includes(row.pocFullName)))) return false;
      }
      return true;
    });

    // Apply sorting across all filtered data
    if (sorter && sorter.columnKey && sorter.order) {
      const { columnKey, order } = sorter;
      data = data.slice().sort((a, b) => {
        let result = 0;
        if (columnKey === 'reservationId') {
          result = (a.reservationId || '').localeCompare(b.reservationId || '');
        } else if (columnKey === 'pocFullName') {
          result = (a.pocFullName || '').localeCompare(b.pocFullName || '');
        } else if (columnKey === 'checkInDate') {
          result = new Date(a.checkInDate || 0).getTime() - new Date(b.checkInDate || 0).getTime();
        } else if (columnKey === 'checkOutDate') {
          result = new Date(a.checkOutDate || 0).getTime() - new Date(b.checkOutDate || 0).getTime();
        } else if (columnKey === 'room') {
          result = (a.room || '').localeCompare(b.room || '');
        } else if (columnKey === 'businessSource') {
          result = (a.businessSource || '').localeCompare(b.businessSource || '');
        } else if (columnKey === 'totalCharges') {
          result = (a.totalCharges || 0) - (b.totalCharges || 0);
        } else if (columnKey === 'balance') {
          result = (a.balance || 0) - (b.balance || 0);
        } else if (columnKey === 'reservationStatus') {
          const aNorm = normalizeStatus(computeStatus(a, todayDayjs));
          const bNorm = normalizeStatus(computeStatus(b, todayDayjs));
          if (order === 'ascend') {
            return STATUS_SORT_ORDERS.ascend.indexOf(aNorm) - STATUS_SORT_ORDERS.ascend.indexOf(bNorm);
          } else if (order === 'descend') {
            return STATUS_SORT_ORDERS.descend.indexOf(aNorm) - STATUS_SORT_ORDERS.descend.indexOf(bNorm);
          }
          // Default: use STATUS_PRIORITY
          return (STATUS_PRIORITY[aNorm] || 99) - (STATUS_PRIORITY[bNorm] || 99);
        } else if (columnKey === 'cancellationPolicy') {
          result = (a.cancellationPolicy || '').localeCompare(b.cancellationPolicy || '');
        }
        return order === 'ascend' ? result : -result;
      });
    } else {
      // Debug: print normalized status and priority for first 10 rows before sorting
      const debugRows = data.slice(0, 10).map(row => {
        const norm = normalizeStatus(computeStatus(row, todayDayjs));
        return { status: computeStatus(row, todayDayjs), normalized: norm, priority: STATUS_PRIORITY[norm] };
      });
      console.log('Default sort debug (first 10 rows):', debugRows);
      // Custom sort: Checked-Out (highest), In-House (second), Unconfirmed/Confirmed (third), then by check-in date ascending within each group
      const statusOrder = ['Checked-Out', 'In-House', 'Confirmed', 'Unconfirmed'];
      data = data.slice().sort((a, b) => {
        const aStatus = normalizeStatus(computeStatus(a, todayDayjs));
        const bStatus = normalizeStatus(computeStatus(b, todayDayjs));
        const aStatusIdx = statusOrder.indexOf(aStatus);
        const bStatusIdx = statusOrder.indexOf(bStatus);
        if (aStatusIdx !== bStatusIdx) return aStatusIdx - bStatusIdx;
        // Secondary: sort by check-in date ascending (chronological)
        const aDate = new Date(a.checkInDate || 0).getTime();
        const bDate = new Date(b.checkInDate || 0).getTime();
        return aDate - bDate;
      });
    }
    // Debug: log the current sorter and first few sorted results
    console.log('Sorter:', sorter, 'First 5 sorted statuses:', data.slice(0, 5).map(row => computeStatus(row, todayDayjs)));
    return data;
  };

  const finalData = getSortedData();
  const pagedDataRaw = finalData.slice((current - 1) * pageSize, current * pageSize);
  let pagedData = [...pagedDataRaw];

  const handleClearAll = () => {
    const defaultFilters = {
      dateRange: null,
      reservationStatus: [],
      buildings: [],
      floors: [],
      businessSources: [],
      roomTypes: [],
      groups: [],
      cancellationPolicy: [],
    };
    setPendingFilters(defaultFilters);
    setFilters(defaultFilters);
  };
  const handleCancel = () => setFilterDrawerOpen(false);

  // Filtering logic
  const filteredData = finalData.filter(row => {
    const computedStatus = computeStatus(row, todayDayjs);
    // Date range
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      const checkIn = dayjs(row.checkInDate);
      if (checkIn.isBefore(start, 'day') || checkIn.isAfter(end, 'day')) return false;
    }
    // Reservation Status (special logic for Checked-Out)
    if (filters.reservationStatus.length) {
      if (!filters.reservationStatus.includes(computedStatus)) return false;
    }
    // Buildings
    if (filters.buildings.length && !filters.buildings.includes(row.building)) return false;
    // Floors
    if (filters.floors.length && !filters.floors.includes(row.floor)) return false;
    // Business Sources
    if (filters.businessSources.length && !filters.businessSources.includes(row.businessSource)) return false;
    // Room Types
    if (filters.roomTypes.length && !filters.roomTypes.includes(row.roomType)) return false;
    if (filters.groups.length) {
      if (!(filters.groups.includes(row.groupName) || (row.isParent && filters.groups.includes(row.pocFullName)))) return false;
    }
    return true;
  });

  const filteredDataWithDemo = filteredData;

  const handleToggleColumn = (key: string) => {
    setCustomColumns(cols =>
      cols.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleMoveColumn = (from: number, to: number) => {
    setCustomColumns(cols => update(cols, {
      $splice: [
        [from, 1],
        [to, 0, cols[from]],
      ],
    }));
  };

  if (customColumns.length === 0) {
    setCustomColumns(CUSTOMIZABLE_COLUMNS.map(col => ({ ...col, visible: true })));
  }
  const visibleColumns = [
    ...MANDATORY_COLUMNS.map(col => ({ ...col, dataIndex: col.key })),
    ...customColumns.filter(col => col.visible).map(col => ({ ...col, dataIndex: col.key })),
  ];
  console.log('Visible columns:', visibleColumns);

  // Render the customize columns dropdown (only for customizable columns)
  const CustomizeColumnsDropdown = () => (
    <div style={{ minWidth: 240, background: '#fff', borderRadius: 8, boxShadow: '0 6px 16px 0 rgba(0,0,0,0.08),0 3px 6px -4px rgba(0,0,0,0.12),0 9px 28px 8px rgba(0,0,0,0.05)', padding: 4 }}>
      <div style={{ fontWeight: 600, fontSize: 14, padding: '12px 16px 8px 16px', borderBottom: '1px solid #f0f0f0' }}>Customize columns</div>
      <div style={{ maxHeight: 320, overflowY: 'auto', padding: '8px 0' }}>
        {customColumns.map((col, idx) => (
          <div 
            key={col.key}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 16px', cursor: 'grab', height: 36 }}
            draggable
            onDragStart={e => { e.dataTransfer.setData('colIdx', String(idx)); }}
            onDrop={e => { e.preventDefault(); const from = Number(e.dataTransfer.getData('colIdx')); handleMoveColumn(from, idx); }}
            onDragOver={e => e.preventDefault()}
          >
            <GripDotsVerticalIcon style={{ color: '#bfbfbf', width: 20, height: 20 }} />
            <Checkbox checked={col.visible} onChange={() => handleToggleColumn(col.key)} style={{ marginRight: 8 }} />
            <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.88)', whiteSpace: 'nowrap', flex: 1 }}>{col.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Add fixed: 'left' to checkbox, Reservation ID, and POC columns
  const columnsWithNesting = visibleColumns.map((col, idx) => {
    let width;
    let fixed: 'left' | 'right' | undefined;
    if (col.key === 'reservationId') {
      width = 180;
      fixed = 'left';
    } else if (col.key === 'pocFullName') {
      width = 180;
      fixed = 'left';
    } else if (col.key === 'checkInDate') width = 160;
    else if (col.key === 'checkOutDate') width = 160;
    else if (col.key === 'room') width = 200;
    else if (col.key === 'businessSource') width = 180;
    else if (col.key === 'totalCharges') width = 150;
    else if (col.key === 'balance') width = 150;
    else if (col.key === 'reservationStatus') width = 140;
    else if (col.key === 'cancellationPolicy') width = 180;
    // Add title and sorter
    const base = {
      ...col,
      width,
      title: col.label,
      sorter:
        col.key === 'reservationId' ? (a: any, b: any) => (a.reservationId || '').localeCompare(b.reservationId || '') :
        col.key === 'pocFullName' ? (a: any, b: any) => (a.pocFullName || '').localeCompare(b.pocFullName || '') :
        col.key === 'checkInDate' ? (a: any, b: any) => new Date(a.checkInDate || 0).getTime() - new Date(b.checkInDate || 0).getTime() :
        col.key === 'checkOutDate' ? (a: any, b: any) => new Date(a.checkOutDate || 0).getTime() - new Date(b.checkOutDate || 0).getTime() :
        col.key === 'room' ? (a: any, b: any) => (a.room || '').localeCompare(b.room || '') :
        col.key === 'businessSource' ? (a: any, b: any) => (a.businessSource || '').localeCompare(b.businessSource || '') :
        col.key === 'totalCharges' ? (a: any, b: any) => (a.totalCharges || 0) - (b.totalCharges || 0) :
        col.key === 'balance' ? (a: any, b: any) => (a.balance || 0) - (b.balance || 0) :
        col.key === 'reservationStatus' ? (a: any, b: any) => 0 :
        col.key === 'cancellationPolicy' ? (a: any, b: any) => (a.cancellationPolicy || '').localeCompare(b.cancellationPolicy || '') :
        undefined,
      render:
        col.key === 'reservationId'
          ? (text: string, record: any) => {
              const computedStatus = computeStatus(record, todayDayjs);
              let keyNum = 0;
              if (typeof record.key === 'number') keyNum = record.key;
              else if (typeof record.key === 'string') {
                const match = record.key.match(/\d+/);
                if (match) keyNum = parseInt(match[0], 10);
              }
              let resIdNum = 0;
              if (typeof record.reservationId === 'string') {
                const match = record.reservationId.match(/\d+/);
                if (match) resIdNum = parseInt(match[0], 10);
              }
              const rareFlag = (keyNum % 13 === 0 || keyNum % 13 === 7 || resIdNum % 13 === 0 || resIdNum % 13 === 7);
              const showFlag = record.balance > 0 && (computedStatus === 'Checked-Out' || computedStatus === 'In-House') && rareFlag;
              // Show group info only for 'Individual (Linked to group)' cells
              const showGroupInfo = !record.isParent && record.groupName;
              let groupName = '';
              if (record.groupName) {
                groupName = record.groupName;
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', minHeight: 0, overflow: 'hidden', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 14, color: '#222', fontWeight: 400, lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', height: 20 }}>{text}</span>
                      {showGroupInfo && (
                        <GroupInfoWithTooltip groupName={groupName} />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: showFlag && record.isParent ? 44 : 14,
                        height: '100%',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {/* Show both icons side by side if both are present */}
                      {showFlag && record.isParent ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                          <Tooltip title={record.pocFullName || 'Group Reservation'} placement="top">
                            <GroupIcon style={{ width: 14, height: 14, verticalAlign: 'middle', color: 'rgba(0,0,0,0.45)', marginRight: 12 }} />
                          </Tooltip>
                          <Tooltip title="Pending Revenue Posting">
                            <FlagOutlined style={{ color: '#E53E3E', fontSize: 14, verticalAlign: 'middle' }} />
                          </Tooltip>
                        </span>
                      ) : (
                        <>
                    {showFlag && (
                      <Tooltip title="Pending Revenue Posting">
                              <FlagOutlined style={{ color: '#E53E3E', fontSize: 14, verticalAlign: 'middle' }} />
                      </Tooltip>
                    )}
                    {record.isParent && (
                      <Tooltip title={record.pocFullName || 'Group Reservation'} placement="top">
                        <GroupIcon style={{ width: 14, height: 14, verticalAlign: 'middle', color: 'rgba(0,0,0,0.45)' }} />
                      </Tooltip>
                    )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          : col.key === 'pocFullName'
            ? (value: string, record: any) => {
                // If the name contains 'Group' or a number, use a real person name from peopleNames
                let displayName = value;
                let email = '';
                const isGroup = /group|\d/.test(value.toLowerCase());
                if (isGroup) {
                  // Pick a real person name from peopleNames based on row key or reservationId
                  let idx = 0;
                  if (typeof record.key === 'number') idx = record.key % peopleNames.length;
                  else if (typeof record.key === 'string') {
                    const match = record.key.match(/\d+/);
                    if (match) idx = parseInt(match[0], 10) % peopleNames.length;
                  }
                  displayName = peopleNames[idx];
                }
                // Generate email from displayName
                if (displayName) {
                  const parts = displayName.trim().split(/\s+/);
                  if (parts.length >= 2) {
                    email = `${parts[0].toLowerCase()}.${parts.slice(1).join('.').toLowerCase()}@example.com`;
                  } else {
                    email = `${displayName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
                  }
                }
                // Show Ban icon for a few rows (e.g., key or reservationId modulo 11 is 0 or 5)
                let keyNum = 0;
                if (typeof record.key === 'number') keyNum = record.key;
                else if (typeof record.key === 'string') {
                  const match = record.key.match(/\d+/);
                  if (match) keyNum = parseInt(match[0], 10);
                }
                let resIdNum = 0;
                if (typeof record.reservationId === 'string') {
                  const match = record.reservationId.match(/\d+/);
                  if (match) resIdNum = parseInt(match[0], 10);
                }
                const showBan = (keyNum % 11 === 0 || keyNum % 11 === 5 || resIdNum % 11 === 0 || resIdNum % 11 === 5);
                return <POCCellWithTooltip displayName={displayName} email={email} showBan={showBan} />;
              }
            : col.key === 'businessSource'
              ? (value: string, record: any) => {
                  // Mapping for business sources that should show CRS ID
                  const crsIdMap: Record<string, string> = {
                    'SynXis Web': 'CRS ID: SYN-123456',
                    'Expedia': 'CRS ID: 123456789',
                    'Booking.com': 'CRS ID: 24680',
                    'Hotels.com': 'CRS ID: HOT-55555',
                    'Travelocity (GHE)': 'CRS ID: GHE-88888',
                    'Agoda': 'CRS ID: AG-987654',
                    'Google Hotel Booking': 'CRS ID: GGL-33333',
                    'Hotwire': 'CRS ID: HW-22222',
                    'Ctrip': 'CRS ID: CT-77777',
                  };
                  let otaId = '';
                  if (value && value.trim().toLowerCase() !== 'walk-in') {
                    otaId = crsIdMap[value] || `CRS ID: ${value}`;
                  }
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                      <span style={{ fontSize: 14, color: '#222', fontWeight: 400, lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
                      {otaId && (
                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', lineHeight: '20px', margin: '2px 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{otaId}</span>
                      )}
                    </div>
                  );
                }
              : col.key === 'room'
                ? (value: string, record: any) => {
                    if (record.isParent && record.key) {
                      // Find the parent in allDataNested to get its children
                      const parent = uniqueData.find((row: any) => row.key === record.key);
                      if (parent && Array.isArray(parent.children) && parent.children.length > 0) {
                        const rooms = parent.children.map((child: any) => child.room).filter(Boolean).join(', ');
                        return <TruncateTooltipCellIfTruncated value={rooms} maxWidth={167} />;
                      }
                    }
                    // Non-group rows: show room if present, otherwise show space if present
                    if (record.room) {
                      return <TruncateTooltipCellIfTruncated value={record.room} maxWidth={167} />;
                    }
                    if (record.space) {
                      return <TruncateTooltipCellIfTruncated value={record.spaceType ? `${record.space} (${record.spaceType})` : record.space} maxWidth={167} />;
                    }
                    return null;
                  }
              : col.key === 'reservationStatus'
                ? (_: any, record: any) => {
                    const computedStatus = computeStatus(record, todayDayjs);
                    return <ReservationStatusTag status={computedStatus} />;
                  }
                : col.key === 'totalCharges'
                  ? (value: number) => (
                      <span style={{ display: 'block', textAlign: 'right', width: '100%' }}>{value.toFixed(2)}</span>
                    )
                : col.key === 'balance'
                  ? (value: number) => {
                      let color = 'rgba(0,0,0,0.88)';
                      let prefix = null;
                      if (value > 0) color = '#3E4BE0';
                      else if (value < 0) {
                        color = '#C53030';
                        prefix = <span style={{ marginRight: 4, fontWeight: 700 }}>-</span>;
                      }
                      return (
                        <span style={{ display: 'block', textAlign: 'right', width: '100%', color }}>
                          {prefix}{Math.abs(value).toFixed(2)}
                        </span>
                      );
                    }
                : col.key === 'checkInDate' || col.key === 'checkOutDate'
                  ? (value: string) => formatDate(value)
                  : undefined,
      onCell:
        col.key === 'reservationId'
          ? () => ({ style: { paddingLeft: 8, paddingRight: 8 } })
          : undefined,
      onHeaderCell:
        col.key === 'reservationId'
          ? () => ({ style: { paddingLeft: 8, paddingRight: 8 } })
          : undefined,
    };
    return fixed ? { ...base, fixed } : base;
  });

  // Robustly move Reservation Status after Room, if both exist
  const roomColIdx = columnsWithNesting.findIndex(col => col.dataIndex === 'room');
  const resStatusColIdx = columnsWithNesting.findIndex(col => col.dataIndex === 'reservationStatus');
  if (roomColIdx !== -1 && resStatusColIdx !== -1 && resStatusColIdx !== roomColIdx + 1) {
    const [resStatusCol] = columnsWithNesting.splice(resStatusColIdx, 1);
    columnsWithNesting.splice(roomColIdx + 1, 0, resStatusCol);
  }

  const handlePageChange = (page: number, size?: number) => {
    setCurrent(page);
    if (size && size !== pageSize) setPageSize(size);
  };

  const isAnyPendingFilterApplied = () => {
    return Object.values(pendingFilters).some(value =>
      Array.isArray(value) ? value.length > 0 : value !== null
    );
  };

  // Calculate paginated data for the current page
  const paginatedRows = filteredDataWithDemo.slice((current - 1) * pageSize, current * pageSize);
  const isShortPage = paginatedRows.length < pageSize;

  const pendingResultsCount = useMemo(() => {
    return finalData.filter(row => {
      const computedStatus = computeStatus(row, todayDayjs);
      if (pendingFilters.dateRange) {
        const [start, end] = pendingFilters.dateRange;
        const checkIn = dayjs(row.checkInDate);
        if (checkIn.isBefore(start, 'day') || checkIn.isAfter(end, 'day')) return false;
      }
      if (pendingFilters.reservationStatus.length) {
        if (!pendingFilters.reservationStatus.includes(computedStatus)) return false;
      }
      if (pendingFilters.buildings.length && !pendingFilters.buildings.includes(row.building)) return false;
      if (pendingFilters.floors.length && !pendingFilters.floors.includes(row.floor)) return false;
      if (pendingFilters.businessSources.length && !pendingFilters.businessSources.includes(row.businessSource)) return false;
      if (pendingFilters.roomTypes.length && !pendingFilters.roomTypes.includes(row.roomType)) return false;
      if (pendingFilters.groups.length) {
        if (!(pendingFilters.groups.includes(row.groupName) || (row.isParent && pendingFilters.groups.includes(row.pocFullName)))) return false;
      }
      return true;
    }).length;
  }, [pendingFilters, finalData, todayDayjs]);

  const [showEmailAlert, setShowEmailAlert] = useState<{ visible: boolean, folioName: string }>({ visible: false, folioName: '' });

  const emailMenu = {
    items: [
      { key: 'Folio', label: 'Folio' },
      { key: 'Detailed Folio', label: 'Detailed Folio' },
      { key: 'Registration Form', label: 'Registration Form' },
    ],
    onClick: (info: { key: string }) => handleEmailDropdownClick(info.key),
  };

  const handleEmailDropdownClick = (optionKey: string) => {
    setShowSpinner(true);
    setTimeout(() => {
      setShowSpinner(false);
      setShowEmailAlert({ visible: true, folioName: optionKey });
    }, 2000);
  };

  const [showCancelModal, setShowCancelModal] = useState(false);
  // Save pending filters before showing cancel modal
  const [savedPendingFilters, setSavedPendingFilters] = useState<typeof pendingFilters | null>(null);

  const hasUnsavedFilterChanges = JSON.stringify(filters) !== JSON.stringify(pendingFilters);

  const [showSpinner, setShowSpinner] = useState(false);

  // Extract all unique group names from the data
  const allGroupNames = useMemo(() => {
    const names = new Set<string>();
    uniqueData.forEach(row => {
      if (row.groupName) names.add(row.groupName);
      if (row.isParent && row.pocFullName) names.add(row.pocFullName);
    });
    return Array.from(names);
  }, [uniqueData]);

  // 1. Extract all unique room and space types from the data
  const allRoomAndSpaceTypes = useMemo(() => {
    const types = new Set<string>();
    uniqueData.forEach(row => {
      if (row.roomType) types.add(row.roomType);
      if (row.spaceType) types.add(row.spaceType);
    });
    return Array.from(types);
  }, [uniqueData]);

  const handlePrintDropdownClick = (optionKey: string) => {
    setShowSpinner(true);
    setTimeout(() => {
      setShowSpinner(false);
      let imgSrc = '';
      if (optionKey === 'Folio') {
        imgSrc = FolioImg;
      } else if (optionKey === 'Detailed Folio') {
        imgSrc = DetailedFolioImg;
      } else if (optionKey === 'Registration Form') {
        imgSrc = RegistrationFormImg;
      }
      if (!imgSrc) return;
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Preview</title>
              <style>
                body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; }
                img { max-width: 100vw; max-height: 100vh; }
              </style>
            </head>
            <body>
              <img src="${imgSrc}" alt="${optionKey}" />
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() { window.close(); };
                };
              <\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }, 2000);
  };

  return (
    <>
      {showSpinner && <Spin fullscreen />}
      {showEmailAlert.visible && (
        <ExportSuccessAlert
          folioNames={showEmailAlert.folioName}
          onClose={() => setShowEmailAlert({ visible: false, folioName: '' })}
        />
      )}
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '60px', display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f6fa', overflow: 'hidden' }}>
        <HeaderBar />
        <div className="main-content" style={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="content-container" style={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <h1 className="batch-folio-heading">Batch Folio</h1>
            <div className="batch-folio-toolbar">
              <div>
                <Input.Search
                  placeholder="Search for reservation ID, point of contact"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  style={{ width: 280, height: 40 }}
                  value={searchText}
                  onChange={e => handleSearch(e.target.value)}
                  onSearch={handleSearch}
                />
              </div>
              <div className="batch-folio-toolbar-actions">
                <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
                  <span style={{ fontSize: 16, marginRight: 8 }}>Checked-Out Reservations</span>
                  <Switch
                    checked={showCheckedOut}
                    onChange={setShowCheckedOut}
                    checkedChildren=""
                    unCheckedChildren=""
                    style={showCheckedOut ? { backgroundColor: '#3E4BE0' } : {}}
                  />
                </div>
                <Button
                  icon={
                    <span style={{ position: 'relative', display: 'inline-block' }}>
                      <FunnelIcon style={{ width: 24, height: 24, color: isAnyPendingFilterApplied() ? '#3E4BE0' : undefined }} />
                      {isAnyPendingFilterApplied() && (
                        <span style={{
                          position: 'absolute',
                          top: -3,
                          right: -3,
                          width: 14,
                          height: 14,
                          background: '#FF3B30',
                          borderRadius: '50%',
                          border: '2px solid #fff',
                          boxSizing: 'border-box',
                          zIndex: 1,
                        }} />
                      )}
                    </span>
                  }
                    className={`batch-folio-toolbar-btn${isAnyPendingFilterApplied() ? ' active-filter' : ''}`}
                  style={isAnyPendingFilterApplied() ? { border: '1px solid #3E4BE0' } : {}}
                  onClick={() => setFilterDrawerOpen(true)}
                />
                <Dropdown
                  overlay={<CustomizeColumnsDropdown />}
                  trigger={["click"]}
                  open={customizeOpen}
                  onOpenChange={setCustomizeOpen}
                  placement="bottomRight"
                  arrow
                >
                  <Button icon={<ColumnsIcon style={{ width: 24, height: 24 }} />} className="batch-folio-toolbar-btn" />
                </Dropdown>
                  {/* New Dropdown Button to the right of Customize Columns */}
                  {selectedRowKeys.length === 0 ? (
                    <Button className="batch-folio-toolbar-btn print-dropdown-btn" disabled>
                      Print <DownOutlined style={{ fontSize: 16, marginLeft: 8 }} />
                    </Button>
                  ) : (
                    <Dropdown
                      menu={{
                        items: [
                          { key: 'folio', label: 'Folio', onClick: () => handlePrintDropdownClick('Folio') },
                          { key: 'detailed-folio', label: 'Detailed Folio', onClick: () => handlePrintDropdownClick('Detailed Folio') },
                          { key: 'registration-form', label: 'Registration Form', onClick: () => handlePrintDropdownClick('Registration Form') },
                        ],
                      }}
                      placement="bottomRight"
                      arrow
                    >
                      <Button className="batch-folio-toolbar-btn print-dropdown-btn">
                        Print <DownOutlined style={{ fontSize: 16, marginLeft: 8 }} />
                      </Button>
                    </Dropdown>
                  )}
                  {/* New Export Dropdown Button to the right of Print */}
                  {selectedRowKeys.length === 0 ? (
                    <Dropdown
                      menu={emailMenu}
                      placement="bottomRight"
                      arrow
                    >
                      <Button className="batch-folio-toolbar-btn print-dropdown-btn" disabled>
                        Email <DownOutlined style={{ fontSize: 16, marginLeft: 8 }} />
                      </Button>
                    </Dropdown>
                  ) : (
                    <Dropdown
                      menu={emailMenu}
                      placement="bottomRight"
                      arrow
                    >
                      <Button className="batch-folio-toolbar-btn print-dropdown-btn">
                        Email <DownOutlined style={{ fontSize: 16, marginLeft: 8 }} />
                      </Button>
                    </Dropdown>
                  )}
              </div>
            </div>
            <div className="table-wrapper">
              <Table
                columns={columnsWithNesting}
                dataSource={pagedData}
                rowKey="key"
                rowSelection={{
                  type: 'checkbox',
                  columnWidth: 56,
                  selectedRowKeys,
                  onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys),
                  fixed: 'left',
                }}
                scroll={{ x: 1350, y: 400 }}
                pagination={false}
                style={{ marginTop: 24 }}
                expandable={{ showExpandColumn: false, expandedRowRender: undefined }}
                childrenColumnName={undefined}
                rowClassName={record => record.isParent ? 'nesting-row-parent' : record.isChild ? 'nesting-row-child' : ''}
                onChange={(pagination, filters, sorterArg) => {
                  let columnKey: string | undefined;
                  let order: 'ascend' | 'descend' | undefined;
                  if (Array.isArray(sorterArg)) {
                    const s = sorterArg[0] || {};
                    columnKey = s.columnKey ? String(s.columnKey) : undefined;
                    order = s.order === 'ascend' || s.order === 'descend' ? s.order : undefined;
                  } else {
                    columnKey = sorterArg && sorterArg.columnKey ? String(sorterArg.columnKey) : undefined;
                    order = sorterArg && (sorterArg.order === 'ascend' || sorterArg.order === 'descend') ? sorterArg.order : undefined;
                  }
                  setSorter({ columnKey, order });
                  setCurrent(1);
                }}
              />
            </div>
              <div className="batch-folio-pagination-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
                <div style={{ flex: 1, textAlign: 'left', color: 'rgba(0,0,0,0.65)', fontSize: 14 }}>
                  Total {finalData.length} results
                </div>
                <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                current={current}
                pageSize={pageSize}
                total={finalData.length}
                showSizeChanger={false}
                pageSizeOptions={pageSizeOptions.map(String)}
                onChange={handlePageChange}
                    style={{ margin: 0 }}
              />
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Select
                    showSearch
                  value={pageSize}
                  onChange={size => {
                    setPageSize(size);
                    setCurrent(1);
                  }}
                  options={pageSizeOptions.map(size => ({ value: size, label: `${size} / page` }))}
                    style={{ height: 30, color: 'rgba(0,0,0,0.65)', fontSize: 14 }}
                    dropdownStyle={{ color: 'rgba(0,0,0,0.65)', minHeight: 30 }}
                    className="per-page-selector-compact"
                />
              </div>
            </div>
            <Drawer
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: 600, fontSize: '16px', flex: 1, color: '#222', lineHeight: '24px' }}>
                    Filters
                  </span>
                  <Button
                    type="primary"
                    icon={<EraserIcon style={{ width: 20, height: 20, color: !isAnyPendingFilterApplied() ? 'rgba(0, 0, 0, 0.25)' : '#fff' }} />}
                    onClick={handleClearAll}
                    style={{ marginLeft: 12, fontSize: 14, lineHeight: '22px', fontWeight: 500 }}
                    disabled={!isAnyPendingFilterApplied()}
                  >
                    Clear All
                  </Button>
                </div>
              }
              placement="right"
              width={400}
              onClose={() => {
                if (hasUnsavedFilterChanges) {
                  setSavedPendingFilters(pendingFilters); // Save current state before showing modal
                  setShowCancelModal(true);
                } else {
                  setFilterDrawerOpen(false);
                }
              }}
              open={filterDrawerOpen}
              bodyStyle={{ padding: 24 }}
              footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 24px' }}>
                  <Button type="text" onClick={() => {
                    if (hasUnsavedFilterChanges) {
                      setSavedPendingFilters(pendingFilters); // Save current state before showing modal
                      setShowCancelModal(true);
                    } else {
                      setFilterDrawerOpen(false);
                    }
                  }} style={{ fontSize: 14, lineHeight: '22px', fontWeight: 500, height: 40 }}>Cancel</Button>
                  <Button type="primary" onClick={() => {
                    setFilters(pendingFilters);
                    setFilterDrawerOpen(false);
                  }} style={{ fontSize: 14, lineHeight: '22px', fontWeight: 500, height: 40 }}>Show {pendingResultsCount} Results</Button>
                </div>
              }
              footerStyle={{ padding: 0 }}
            >
              <Form layout="vertical">
                <Form.Item label="Duration">
                  <DatePicker.RangePicker
                    value={pendingFilters.dateRange}
                    onChange={val => {
                      // Normalize: if val is null or contains nulls, set to null
                      const normalized = val && val[0] && val[1] ? val as [dayjs.Dayjs, dayjs.Dayjs] : null;
                      setPendingFilters(f => ({ ...f, dateRange: normalized }));
                    }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item label="Status">
                  <Select
                    mode="multiple"
                    value={pendingFilters.reservationStatus}
                    onChange={val => setPendingFilters(f => ({ ...f, reservationStatus: val }))}
                    options={RESERVATION_STATUSES.map(s => ({ value: s.value, label: s.label }))}
                    placeholder="Select status"
                    style={{ width: '100%', height: 40 }}
                    maxTagCount={2}
                    maxTagPlaceholder={omittedValues => (
                      <span style={{ display: 'inline-block', background: '#f0f0f0', borderRadius: 16, padding: '0 8px', fontSize: 14, color: '#222', height: 32, lineHeight: '32px', marginRight: 4 }}>
                        +{omittedValues.length}
                      </span>
                    )}
                  />
                </Form.Item>
                <Form.Item label="Room/Space Type">
                  <Select
                    mode="multiple"
                    value={pendingFilters.roomTypes}
                    onChange={val => setPendingFilters(f => ({ ...f, roomTypes: val }))}
                    options={allRoomAndSpaceTypes.map(type => ({ value: type, label: type }))}
                    placeholder="Select room or space types"
                    style={{ width: '100%', height: 40 }}
                    maxTagCount={2}
                    maxTagPlaceholder={omittedValues => (
                      <span style={{ display: 'inline-block', background: '#f0f0f0', borderRadius: 16, padding: '0 8px', fontSize: 14, color: '#222', height: 32, lineHeight: '32px', marginRight: 4 }}>
                        +{omittedValues.length}
                      </span>
                    )}
                  />
                </Form.Item>
                <Form.Item label="Groups">
                  <Select
                    mode="multiple"
                    value={pendingFilters.groups}
                    onChange={val => setPendingFilters(f => ({ ...f, groups: val }))}
                    options={allGroupNames.map(name => ({ value: name, label: name }))}
                    placeholder="Select groups"
                    style={{ width: '100%', height: 40 }}
                    maxTagCount={2}
                    maxTagPlaceholder={omittedValues => (
                      <span style={{ display: 'inline-block', background: '#f0f0f0', borderRadius: 16, padding: '0 8px', fontSize: 14, color: '#222', height: 32, lineHeight: '32px', marginRight: 4 }}>
                        +{omittedValues.length}
                      </span>
                    )}
                  />
                </Form.Item>
                <Form.Item label="Business Sources">
                  <Select
                    mode="multiple"
                    value={pendingFilters.businessSources}
                    onChange={val => setPendingFilters(f => ({ ...f, businessSources: val }))}
                    options={businessSources.map(s => ({ value: s, label: s }))}
                    placeholder="Select business sources"
                    style={{ width: '100%', height: 40 }}
                    maxTagCount={2}
                    maxTagPlaceholder={omittedValues => (
                      <span style={{ display: 'inline-block', background: '#f0f0f0', borderRadius: 16, padding: '0 8px', fontSize: 14, color: '#222', height: 32, lineHeight: '32px', marginRight: 4 }}>
                        +{omittedValues.length}
                      </span>
                    )}
                  />
                </Form.Item>
                <Form.Item label="Cancellation Policy">
                  <Select
                    mode="multiple"
                    value={pendingFilters.cancellationPolicy}
                    onChange={val => setPendingFilters(f => ({ ...f, cancellationPolicy: val }))}
                    options={cancellationPolicies.map(s => ({ value: s, label: s }))}
                    placeholder="Select cancellation policy"
                    style={{ width: '100%', height: 40 }}
                    maxTagCount={2}
                    maxTagPlaceholder={omittedValues => (
                      <span style={{ display: 'inline-block', background: '#f0f0f0', borderRadius: 16, padding: '0 8px', fontSize: 14, color: '#222', height: 32, lineHeight: '32px', marginRight: 4 }}>
                        +{omittedValues.length}
                      </span>
                    )}
                  />
                </Form.Item>
                <Form.Item label="Buildings">
                  <Select
                    mode="multiple"
                    value={pendingFilters.buildings}
                    onChange={val => setPendingFilters(f => ({ ...f, buildings: val }))}
                    options={BUILDINGS.map(b => ({ value: b, label: b }))}
                    placeholder="Select buildings"
                    style={{ width: '100%', height: 40 }}
                    maxTagCount={2}
                    maxTagPlaceholder={omittedValues => (
                      <span style={{ display: 'inline-block', background: '#f0f0f0', borderRadius: 16, padding: '0 8px', fontSize: 14, color: '#222', height: 32, lineHeight: '32px', marginRight: 4 }}>
                        +{omittedValues.length}
                      </span>
                    )}
                  />
                </Form.Item>
                <Form.Item label="Floors">
                  <Select
                    mode="multiple"
                    value={pendingFilters.floors}
                    onChange={val => setPendingFilters(f => ({ ...f, floors: val }))}
                    options={FLOORS.map(f => ({ value: f, label: f }))}
                    placeholder="Select floors"
                    style={{ width: '100%', height: 40 }}
                    maxTagCount={2}
                    maxTagPlaceholder={omittedValues => (
                      <span style={{ display: 'inline-block', background: '#f0f0f0', borderRadius: 16, padding: '0 8px', fontSize: 14, color: '#222', height: 32, lineHeight: '32px', marginRight: 4 }}>
                        +{omittedValues.length}
                      </span>
                    )}
                  />
                </Form.Item>
              </Form>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
    {/* Cancel Confirmation Modal */}
    <Modal
      open={showCancelModal}
      onCancel={() => setShowCancelModal(false)}
      footer={null}
      centered
      closable={false}
      width={400}
      bodyStyle={{ padding: 0, background: '#fff', boxShadow: 'none' }}
    >
      <div className="modal-cancel-content" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#fff' }}>
        <InfoIcon style={{ width: 24, height: 24, flex: 'none', marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 16, color: 'rgba(0,0,0,0.88)' }}>
              Cancel Batch Folio Filtration?
            </span>
            <CloseOutlined style={{ fontSize: 18, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }} onClick={() => setShowCancelModal(false)} />
          </div>
          <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)', marginBottom: 12 }}>
            Proceeding will erase newly entered data, and you will need to start over.
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              type="default"
              onClick={() => {
                // Restore previous filter state and re-open drawer
                if (savedPendingFilters) setPendingFilters(savedPendingFilters);
                setShowCancelModal(false);
                setFilterDrawerOpen(true);
              }}
              style={{ minWidth: 120, fontWeight: 500 }}
            >
              No, Keep Editing
            </Button>
            <Button
              type="primary"
              onClick={() => {
                // Reset all filters and close everything
                const defaultFilters = {
                  dateRange: null,
                  reservationStatus: [],
                  buildings: [],
                  floors: [],
                  businessSources: [],
                  roomTypes: [],
                  groups: [],
                  cancellationPolicy: [],
                };
                setShowCancelModal(false);
                setFilterDrawerOpen(false);
                setFilters(defaultFilters);
                setPendingFilters(defaultFilters);
              }}
              style={{ minWidth: 120, fontWeight: 500, background: '#3E4BE0', borderColor: '#3E4BE0', color: '#fff' }}
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default BatchFolio; 