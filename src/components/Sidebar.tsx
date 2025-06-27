import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  BuildOutlined,
  CalendarOutlined,
  DesktopOutlined,
  DownOutlined,
  EyeOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HomeOutlined,
  KeyOutlined,
  SettingOutlined,
  SwapOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './Sidebar.css';
import AsiLogo from '../assets/Icons/Identity Logo 1.svg';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  label: string;
  icon: React.FC<any>;
  children?: { label: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Views',
    icon: EyeOutlined,
    children: [{ label: 'Calendar' }],
  },
  {
    label: 'Reservations',
    icon: CalendarOutlined,
    children: [
      { label: 'Create Room Reservation' },
      { label: 'Create Space Reservation' },
    ],
  },
  {
    label: 'Front desk',
    icon: DesktopOutlined,
    children: [
      { label: 'Guest Ledger' },
      { label: 'Batch Folio' },
      { label: 'Change Room Status' },
    ],
  },
  {
    label: 'Rates and Availability',
    icon: BarChartOutlined,
    children: [
      { label: 'Inventory and Forecast' },
      { label: 'Rate Adjustment Panel' },
      { label: 'Restrictons' },
    ],
  },
  { label: 'Reports', icon: FileTextOutlined },
  {
    label: 'Guests',
    icon: UsergroupAddOutlined,
    children: [{ label: 'Guest Database' }, { label: 'Group Database' }],
  },
  {
    label: 'Audit',
    icon: AuditOutlined,
    children: [
      { label: 'Night Audit' },
      { label: 'No Show / Cancel Revenue Posting' },
      { label: 'Credit Card Authorization' },
      { label: 'CRS Bulk Update' },
    ],
  },
  {
    label: 'Business Channels',
    icon: GlobalOutlined,
    children: [
      { label: 'Business Source Channels' },
      { label: 'Business Sources' },
      { label: 'Invoice' },
      { label: 'Commission Invoice' },
    ],
  },
  {
    label: 'Housekeeping',
    icon: HomeOutlined,
    children: [
      { label: 'Tasks' },
      { label: 'Group Members and Task Setup' },
      { label: 'Assignment' },
    ],
  },
  { label: 'Property Configuration', icon: BuildOutlined },
  { label: 'Roles and Privileges', icon: KeyOutlined },
  { label: 'Users', icon: UserOutlined },
  {
    label: 'Policies',
    icon: FileProtectOutlined,
    children: [{ label: 'Cancellation Policies' }],
  },
  {
    label: 'Settings',
    icon: SettingOutlined,
    children: [
      { label: 'General Settings' },
      { label: 'CRS Tax Exempt' },
      { label: 'Device Configuration' },
    ],
  },
  {
    label: 'Mapping to OTA',
    icon: SwapOutlined,
    children: [
      { label: 'Engine Mapping' },
      { label: 'Hotel Engine' },
      { label: 'Engine Configuration' },
    ],
  },
  {
    label: 'Miscellaneous',
    icon: AppstoreOutlined,
    children: [{ label: 'Fail/Warning Request' }],
  },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('Create Room Reservation');
  const [openKeys, setOpenKeys] = useState<string[]>(['Reservations']);
  const [lineStyle, setLineStyle] = useState({});
  const submenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const parent = menuItems.find((item) =>
      item.children?.some((child) => child.label === selectedItem)
    );

    if (parent && submenuRefs.current[parent.label]) {
      const submenuEl = submenuRefs.current[parent.label];
      const selectedEl = Array.from(submenuEl?.children || []).find(
        (el) => el.textContent === selectedItem
      ) as HTMLElement;

      if (selectedEl) {
        setLineStyle({
          top: selectedEl.offsetTop,
          height: selectedEl.offsetHeight,
          opacity: 1,
        });
      }
    } else {
      setLineStyle({ opacity: 0 });
    }
  }, [selectedItem, openKeys, collapsed]);

  const handleToggleCollapsed = () => {
    setCollapsed((prev) => !prev);
    if (!collapsed) {
      setOpenKeys([]);
    }
  };

  const handleParentClick = (key: string) => {
    setOpenKeys((prev) => (prev.includes(key) ? [] : [key]));
  };

  const handleChildClick = (key: string) => {
    setSelectedItem(key);
    setCollapsed(true);
    if (key === 'Batch Folio') {
      navigate('/batch-folio');
    }
  };

  const activeParentKey = menuItems.find(p => p.children?.some(c => c.label === selectedItem))?.label;

  return (
    <>
      {!collapsed && <div className="sidebar-backdrop" onClick={handleToggleCollapsed} />}
      <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-fixed">
            <div className="sidebar-logo-circle" onClick={handleToggleCollapsed}>RH</div>
          </div>
          {!collapsed && (
            <div className="sidebar-header-info">
              <div className="sidebar-header-title">Royal Homes</div>
              <div className="sidebar-header-meta">#29921 <span className="sidebar-header-divider" /> Royal Mansions</div>
            </div>
          )}
        </div>

        <div className="sidebar-content">
          <div className="sidebar-menu-list">
            {menuItems.map(({ label, icon: Icon, children }) => {
              const isOpen = openKeys.includes(label);
              const isParentActive = activeParentKey === label;
              const isSelected = selectedItem === label;
              // Collapsed: Tooltip for all, Dropdown for parents with children
              if (collapsed) {
                if (children) {
                  // Custom dropdown for parent with children
                  const dropdownContent = (
                    <div className="sidebar-dropdown-menu">
                      <div className="sidebar-dropdown-heading">{label}</div>
                      <div className="sidebar-dropdown-separator" />
                      <div className="sidebar-dropdown-children">
                        {children.map((child) => (
                          <div
                            key={child.label}
                            className={`sidebar-dropdown-child${selectedItem === child.label ? ' selected' : ''}`}
                            onClick={() => handleChildClick(child.label)}
                          >
                            {child.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                  return (
                    <Dropdown
                      key={label}
                      overlay={dropdownContent}
                      placement="bottomRight"
                      trigger={["hover"]}
                      overlayClassName="sidebar-dropdown-overlay"
                      mouseEnterDelay={0}
                      align={{
                        points: ['cl', 'cr'], // Align center-left of menu to center-right of trigger
                        offset: [8, 0],     // Add 8px horizontal offset
                      }}
                    >
                      <div className={`sidebar-menu-item${isParentActive ? ' selected' : ''}`}
                        style={{ justifyContent: 'center' }}
                      >
                        <Icon className="sidebar-menu-icon" />
                      </div>
                    </Dropdown>
                  );
                } else {
                  // Dropdown with only heading for single parent
                  const dropdownContent = (
                    <div className="sidebar-dropdown-menu">
                      <div className="sidebar-dropdown-heading">{label}</div>
                    </div>
                  );
                  return (
                    <Dropdown
                      key={label}
                      overlay={dropdownContent}
                      placement="bottomRight"
                      trigger={["hover"]}
                      overlayClassName="sidebar-dropdown-overlay"
                      mouseEnterDelay={0}
                      align={{
                        points: ['cl', 'cr'], // Align center-left of menu to center-right of trigger
                        offset: [8, 0],     // Add 8px horizontal offset
                      }}
                    >
                      <div
                        className={`sidebar-menu-item${isSelected ? ' selected' : ''}`}
                        style={{ justifyContent: 'center' }}
                        onClick={() => handleChildClick(label)}
                      >
                        <Icon className="sidebar-menu-icon" />
                      </div>
                    </Dropdown>
                  );
                }
              }
              // Expanded rendering
              return (
                <div key={label} className={`sidebar-menu-group ${isParentActive ? 'parent-active' : ''}`}>
                  <div
                    className={`sidebar-menu-item ${isParentActive || (!children && selectedItem === label) ? 'selected' : ''}`}
                    onClick={() => (children ? handleParentClick(label) : handleChildClick(label))}
                    aria-expanded={children ? isOpen : undefined}
                  >
                    <Icon className="sidebar-menu-icon" />
                    <span className="sidebar-menu-label">{label}</span>
                    {children && (
                      <DownOutlined
                        className={`sidebar-menu-arrow${isOpen ? ' open' : ''}`}
                      />
                    )}
                  </div>
                  {children && (
                    <div className={`sidebar-submenu-container${isOpen ? ' open' : ''}`}>
                      <div
                        className="sidebar-submenu"
                        ref={(el) => {
                          submenuRefs.current[label] = el;
                        }}
                      >
                        <div className="submenu-selected-line" style={isParentActive ? lineStyle : { opacity: 0 }}></div>
                        {children.map((child) => (
                          <div
                            key={child.label}
                            className={`sidebar-submenu-item${selectedItem === child.label ? ' selected' : ''}`}
                            onClick={() => handleChildClick(child.label)}
                          >
                            {child.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="sidebar-bottom-wrapper">
          {!collapsed && (
            <div className="sidebar-dates">
              <div className="sidebar-date-block">
                <div className="sidebar-date-label">Working date</div>
                <div className="sidebar-date-value">20/03/2025</div>
              </div>
              <div className="sidebar-date-block">
                <div className="sidebar-date-label">System date</div>
                <div className="sidebar-date-value">20/03/2025</div>
              </div>
            </div>
          )}
          <div className="sidebar-footer">
            <div className="sidebar-logo-fixed">
              <img src={AsiLogo} alt="Anand Systems Inc. Logo" className="sidebar-footer-logo" />
            </div>
            {!collapsed && (
              <div className="sidebar-footer-info">
                <div className="sidebar-footer-title">Anand Systems Inc.</div>
                <div className="sidebar-footer-meta">Version 3.2</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;