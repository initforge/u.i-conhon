import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="card text-center">
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-tet-red-700 mb-2">
          Đã gửi thành công!
        </h3>
        <p className="text-gray-600">
          Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card relative">
      <img
        src="/assets/decorations/form_img.png"
        alt=""
        className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none"
      />
      
      <h3 className="text-xl font-bold mb-4 text-tet-red-700">
        Gửi tin nhắn
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Họ và tên
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Số điện thoại
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Nội dung
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="input-field"
          rows={5}
          required
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Gửi tin nhắn
      </button>
    </form>
  );
};

export default ContactForm;

