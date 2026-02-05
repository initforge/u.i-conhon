import React, { useState, useRef, useEffect } from 'react';

export interface Bank {
    code: string;
    name: string;
    shortName: string;
}

// Danh sách 44 ngân hàng thành viên NAPAS - chuyển tiền nhanh 24/7
export const BANKS: Bank[] = [
    // Ngân hàng phổ biến nhất
    { code: 'VCB', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam', shortName: 'Vietcombank' },
    { code: 'TCB', name: 'Ngân hàng TMCP Kỹ Thương Việt Nam', shortName: 'Techcombank' },
    { code: 'MB', name: 'Ngân hàng TMCP Quân Đội', shortName: 'MB Bank' },
    { code: 'VTB', name: 'Ngân hàng TMCP Công Thương Việt Nam', shortName: 'VietinBank' },
    { code: 'BIDV', name: 'Ngân hàng TMCP Đầu Tư và Phát Triển Việt Nam', shortName: 'BIDV' },
    { code: 'ACB', name: 'Ngân hàng TMCP Á Châu', shortName: 'ACB' },
    { code: 'VPB', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', shortName: 'VPBank' },
    { code: 'TPB', name: 'Ngân hàng TMCP Tiên Phong', shortName: 'TPBank' },
    { code: 'STB', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', shortName: 'Sacombank' },
    { code: 'HDB', name: 'Ngân hàng TMCP Phát Triển TP.HCM', shortName: 'HDBank' },
    { code: 'VIB', name: 'Ngân hàng TMCP Quốc Tế Việt Nam', shortName: 'VIB' },
    { code: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội', shortName: 'SHB' },
    { code: 'EIB', name: 'Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam', shortName: 'Eximbank' },
    { code: 'MSB', name: 'Ngân hàng TMCP Hàng Hải Việt Nam', shortName: 'MSB' },
    { code: 'OCB', name: 'Ngân hàng TMCP Phương Đông', shortName: 'OCB' },
    { code: 'LPB', name: 'Ngân hàng TMCP Bưu Điện Liên Việt', shortName: 'LPBank' },
    { code: 'SEA', name: 'Ngân hàng TMCP Đông Nam Á', shortName: 'SeABank' },
    { code: 'AGR', name: 'Ngân hàng Nông Nghiệp và Phát Triển Nông Thôn', shortName: 'Agribank' },
    // Ngân hàng khác
    { code: 'DAB', name: 'Ngân hàng TMCP Đông Á', shortName: 'DongA Bank' },
    { code: 'SGB', name: 'Ngân hàng TMCP Sài Gòn Công Thương', shortName: 'Saigonbank' },
    { code: 'GPB', name: 'Ngân hàng TMCP Dầu Khí Toàn Cầu', shortName: 'GPBank' },
    { code: 'PGB', name: 'Ngân hàng TMCP Xăng Dầu Petrolimex', shortName: 'PGBank' },
    { code: 'PVC', name: 'Ngân hàng TMCP Đại Chúng Việt Nam', shortName: 'PVcomBank' },
    { code: 'KLB', name: 'Ngân hàng TMCP Kiên Long', shortName: 'Kienlongbank' },
    { code: 'VCB2', name: 'Ngân hàng TMCP Bản Việt', shortName: 'VietCapital Bank' },
    { code: 'VBB', name: 'Ngân hàng TMCP Việt Nam Thương Tín', shortName: 'VietBank' },
    { code: 'OJB', name: 'Ngân hàng TMCP Đại Dương', shortName: 'OceanBank' },
    { code: 'ABB', name: 'Ngân hàng TMCP An Bình', shortName: 'ABBank' },
    { code: 'VRB', name: 'Ngân hàng Liên doanh Việt - Nga', shortName: 'VRB' },
    { code: 'VAB', name: 'Ngân hàng TMCP Việt Á', shortName: 'VietABank' },
    { code: 'NCB', name: 'Ngân hàng TMCP Quốc Dân', shortName: 'NCB' },
    { code: 'HLB', name: 'Ngân hàng Hong Leong Việt Nam', shortName: 'Hong Leong Bank' },
    { code: 'BAB', name: 'Ngân hàng TMCP Bắc Á', shortName: 'Bac A Bank' },
    { code: 'BVB', name: 'Ngân hàng TMCP Bảo Việt', shortName: 'Bao Viet Bank' },
    { code: 'SHBVN', name: 'Ngân hàng TNHH MTV Shinhan Việt Nam', shortName: 'Shinhan Bank' },
    { code: 'VPUB', name: 'Ngân hàng TNHH MTV Public Việt Nam', shortName: 'VID Public Bank' },
    { code: 'SCB', name: 'Ngân hàng TMCP Sài Gòn', shortName: 'SCB' },
    { code: 'NAB', name: 'Ngân hàng TMCP Nam Á', shortName: 'Nam A Bank' },
    { code: 'IVB', name: 'Ngân hàng TNHH Indovina', shortName: 'Indovina Bank' },
    { code: 'WRB', name: 'Ngân hàng TNHH Woori Việt Nam', shortName: 'Woori Bank' },
    { code: 'IBK', name: 'Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh HN', shortName: 'IBK' },
    { code: 'COOPB', name: 'Ngân hàng Hợp tác xã Việt Nam', shortName: 'Co-opBank' },
    { code: 'CIMB', name: 'Ngân hàng TNHH MTV CIMB Việt Nam', shortName: 'CIMB Vietnam' },
];

interface SearchableBankDropdownProps {
    value: string;  // bank code
    onChange: (bankCode: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchableBankDropdown: React.FC<SearchableBankDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Chọn ngân hàng...',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get selected bank
    const selectedBank = BANKS.find(b => b.code === value);

    // Filter banks by search term
    const filteredBanks = BANKS.filter(bank =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (bank: Bank) => {
        onChange(bank.code);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleInputClick = () => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Display selected or placeholder */}
            <div
                onClick={handleInputClick}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white flex items-center justify-between hover:border-gray-400 transition"
            >
                <span className={selectedBank ? 'text-gray-800' : 'text-gray-400'}>
                    {selectedBank ? `${selectedBank.shortName} - ${selectedBank.name}` : placeholder}
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    {/* Search input */}
                    <div className="p-2 border-b sticky top-0 bg-white">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="🔍 Tìm kiếm ngân hàng..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-sm"
                            autoFocus
                        />
                    </div>

                    {/* Bank list */}
                    <div className="max-h-48 overflow-y-auto">
                        {filteredBanks.length === 0 ? (
                            <div className="px-4 py-3 text-gray-500 text-center text-sm">
                                Không tìm thấy ngân hàng
                            </div>
                        ) : (
                            filteredBanks.map((bank) => (
                                <div
                                    key={bank.code}
                                    onClick={() => handleSelect(bank)}
                                    className={`px-4 py-3 cursor-pointer hover:bg-red-50 transition ${value === bank.code ? 'bg-red-100 text-red-700' : ''
                                        }`}
                                >
                                    <div className="font-medium text-sm">{bank.shortName}</div>
                                    <div className="text-xs text-gray-500">{bank.name}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableBankDropdown;
