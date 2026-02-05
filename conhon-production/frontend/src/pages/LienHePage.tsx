import React from 'react';
import ContactForm from '../components/ContactForm';
import FloatingZaloButton from '../components/FloatingZaloButton';

const LienHePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="section-title text-tet-red-800 mb-4">
            Liên hệ
          </h1>
          <p className="text-lg text-gray-600">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="card">
            <h2 className="text-2xl font-bold text-tet-red-700 mb-6">
              Thông tin liên hệ
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/assets/icons/ico_phone_footer.svg"
                  alt="Phone"
                  className="w-8 h-8"
                />
                <div>
                  <p className="text-gray-600">Số điện thoại</p>
                  <a
                    href="tel:0332697909"
                    className="text-tet-red-600 font-semibold hover:underline"
                  >
                    0332697909
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="/assets/icons/ico_email_footer.svg"
                  alt="Zalo"
                  className="w-8 h-8"
                />
                <div>
                  <p className="text-gray-600">Zalo</p>
                  <a
                    href="https://zalo.me/0332697909"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tet-red-600 font-semibold hover:underline"
                  >
                    0332697909
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="https://zalo.me/0332697909"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center inline-block"
              >
                Mở Zalo ngay
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
      <FloatingZaloButton />
    </div>
  );
};

export default LienHePage;

