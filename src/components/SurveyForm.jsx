import React, { useState } from 'react';
import ThankYouModal from './ThankYouModal';
import LanguageSwitcher from './LanguageSwitcher';
import { saveSurveyData } from '../utils/storage';

function SurveyForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    governorate: '',
    currentStatus: '',
    educationGap: '',
    usedPlatforms: '',
    certificatesValue: '',
    desiredSkills: [],
    certificationImportance: 3,
    jobOpportunitiesImportance: '',
    preferredPrice: '',
    pointsMotivation: '',
    tryPlatform: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const governorates = [
    { value: 'baghdad', label: 'بغداد' },
    { value: 'basra', label: 'البصرة' },
    { value: 'mosul', label: 'الموصل' },
    { value: 'erbil', label: 'أربيل' },
    { value: 'karbala', label: 'كربلاء' },
    { value: 'other', label: 'غير محافظة' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => {
        const newSkills = checked 
          ? [...prev.desiredSkills, value]
          : prev.desiredSkills.filter(skill => skill !== value);
        return { ...prev, desiredSkills: newSkills };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const success = await saveSurveyData(formData);
      if (success) {
        setIsModalOpen(true);
        // Reset form after successful submission
        setFormData({
          fullName: '',
          email: '',
          governorate: '',
          currentStatus: '',
          educationGap: '',
          usedPlatforms: '',
          certificatesValue: '',
          desiredSkills: [],
          certificationImportance: 3,
          jobOpportunitiesImportance: '',
          preferredPrice: '',
          pointsMotivation: '',
          tryPlatform: ''
        });
      } else {
        setSubmitError(isRTL ? 'حدث خطأ في حفظ البيانات' : 'Error saving data');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(isRTL ? 'حدث خطأ في إرسال الاستبيان' : 'Error submitting survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    const newRTL = !isRTL;
    setIsRTL(newRTL);
    document.body.dir = newRTL ? 'rtl' : 'ltr';
  };

  return (
    <div className={`bg-white p-8 rounded-lg shadow-md ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">
          {isRTL ? 'مساعدتك في العثور على فرص عمل من خلال التعلم المهني' : 'Helping you find job opportunities through professional learning'}
        </h1>
        <LanguageSwitcher isRTL={isRTL} toggleLanguage={toggleLanguage} />
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* الاسم الكامل */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'الاسم الكامل' : 'Full Name'}
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'البريد الإلكتروني' : 'Email'}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* محافظة السكن */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'محافظة السكن' : 'Residence Governorate'}
          </label>
          <select
            name="governorate"
            value={formData.governorate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">{isRTL ? '-- اختر محافظة --' : '-- Select Governorate --'}</option>
            {governorates.map((gov) => (
              <option key={gov.value} value={gov.value}>
                {isRTL ? gov.label : gov.value.charAt(0).toUpperCase() + gov.value.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* باقي حقول الاستبيان (كما هي) */}
        {/* السؤال 1: الوضع الحالي */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            1. {isRTL ? 'ما هو وضعك الحالي؟' : 'What is your current status?'}
          </p>
          <div className="space-y-2">
            {[
              { value: 'student', label: isRTL ? 'طالب' : 'Student' },
              { value: 'graduate', label: isRTL ? 'خريج جديد' : 'Recent graduate' },
              { value: 'employed', label: isRTL ? 'موظف' : 'Employed' },
              { value: 'unemployed', label: isRTL ? 'عاطل عن العمل' : 'Unemployed' },
              { value: 'freelancer', label: isRTL ? 'فريلانسر' : 'Freelancer' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="currentStatus"
                  value={option.value}
                  checked={formData.currentStatus === option.value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* السؤال 2: صعوبة ربط الدراسة بسوق العمل */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            2. {isRTL ? 'هل واجهت صعوبة في ربط دراستك الجامعية بمتطلبات سوق العمل؟' : 'Have you faced difficulty linking your university studies to labor market requirements?'}
          </p>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="educationGap"
                value="yes"
                checked={formData.educationGap === 'yes'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'نعم' : 'Yes'}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="educationGap"
                value="no"
                checked={formData.educationGap === 'no'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'لا' : 'No'}</span>
            </label>
          </div>
        </div>

        {/* السؤال 3: استخدام منصات تعليمية */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            3. {isRTL ? 'هل استخدمت من قبل منصات تعليمية مثل Coursera، Udemy أو غيرها؟' : 'Have you used educational platforms like Coursera, Udemy, etc. before?'}
          </p>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="usedPlatforms"
                value="yes"
                checked={formData.usedPlatforms === 'yes'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'نعم' : 'Yes'}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="usedPlatforms"
                value="no"
                checked={formData.usedPlatforms === 'no'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'لا' : 'No'}</span>
            </label>
          </div>
        </div>

        {/* السؤال 4: شهادات معتمدة */}
        {formData.usedPlatforms === 'yes' && (
          <div className="border-t pt-4">
            <p className="text-lg font-medium mb-3">
              4. {isRTL ? 'هل حصلت على شهادة معتمدة من هذه المنصات؟ وهل كانت مفيدة في التوظيف؟' : 'Did you get a certified certificate from these platforms? Was it useful for employment?'}
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="certificatesValue"
                  value="yes-useful"
                  checked={formData.certificatesValue === 'yes-useful'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>{isRTL ? 'نعم، وكانت مفيدة' : 'Yes, and it was useful'}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="certificatesValue"
                  value="yes-not-useful"
                  checked={formData.certificatesValue === 'yes-not-useful'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>{isRTL ? 'نعم، لكنها لم تساعد في التوظيف' : 'Yes, but it did not help in employment'}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="certificatesValue"
                  value="no"
                  checked={formData.certificatesValue === 'no'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>{isRTL ? 'لا' : 'No'}</span>
              </label>
            </div>
          </div>
        )}

        {/* السؤال 5: المهارات المطلوبة */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            5. {isRTL ? 'ما نوع المهارات التي تود تعلمها حاليًا؟' : 'What type of skills would you like to learn currently?'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { value: 'programming', label: isRTL ? 'برمجة' : 'Programming' },
              { value: 'design', label: isRTL ? 'تصميم' : 'Design' },
              { value: 'marketing', label: isRTL ? 'تسويق رقمي' : 'Digital Marketing' },
              { value: 'management', label: isRTL ? 'إدارة مشاريع' : 'Project Management' },
              { value: 'soft-skills', label: isRTL ? 'مهارات شخصية' : 'Soft Skills' },
              { value: 'other', label: isRTL ? 'غير ذلك' : 'Other' }
            ].map((skill) => (
              <label key={skill.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="desiredSkills"
                  value={skill.value}
                  checked={formData.desiredSkills.includes(skill.value)}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>{skill.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* السؤال 6: أهمية الشهادة المعتمدة */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            6. {isRTL ? 'ما مدى أهمية أن تكون الشهادة معترف بها من شركة كبرى (Google، Meta... إلخ)؟' : 'How important is it that the certificate is recognized by a major company (Google, Meta, etc.)?'}
          </p>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span>{isRTL ? 'غير مهمة' : 'Not important'}</span>
              <span>{isRTL ? 'مهمة جدًا' : 'Very important'}</span>
            </div>
            <input
              type="range"
              name="certificationImportance"
              min="1"
              max="5"
              value={formData.certificationImportance}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((num) => (
                <span key={num}>{num}</span>
              ))}
            </div>
          </div>
        </div>

        {/* السؤال 7: الوصول لفرص عمل */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            7. {isRTL ? 'هل يهمك أن تساعدك المنصة في الوصول إلى فرص عمل بعد التعلم؟' : 'Do you care if the platform helps you reach job opportunities after learning?'}
          </p>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="jobOpportunitiesImportance"
                value="very-important"
                checked={formData.jobOpportunitiesImportance === 'very-important'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'نعم جدًا' : 'Very much'}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="jobOpportunitiesImportance"
                value="somewhat"
                checked={formData.jobOpportunitiesImportance === 'somewhat'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'إلى حد ما' : 'Somewhat'}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="jobOpportunitiesImportance"
                value="not-important"
                checked={formData.jobOpportunitiesImportance === 'not-important'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'لا يهمني' : "Doesn't matter"}</span>
            </label>
          </div>
        </div>

        {/* السؤال 8: السعر المناسب */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            8. {isRTL ? 'ما السعر الشهري المناسب لك لاشتراك في منصة بهذه الميزات؟' : 'What is the appropriate monthly price for you to subscribe to a platform with these features?'}
          </p>
          <div className="space-y-2">
            {[
              { value: 'free', label: isRTL ? 'مجانًا فقط' : 'Free only' },
              { value: 'less-than-10', label: isRTL ? 'أقل من $10' : 'Less than $10' },
              { value: '10-20', label: isRTL ? '$10–20' : '$10–20' },
              { value: 'more-than-20', label: isRTL ? 'أكثر من $20' : 'More than $20' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="preferredPrice"
                  value={option.value}
                  checked={formData.preferredPrice === option.value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* السؤال 9: نظام النقاط */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            9. {isRTL ? 'هل تحفّزك فكرة وجود نظام نقاط/جوائز لتحفيز التعلم؟' : 'Does the idea of a points/rewards system motivate you to learn?'}
          </p>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="pointsMotivation"
                value="yes"
                checked={formData.pointsMotivation === 'yes'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'نعم' : 'Yes'}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="pointsMotivation"
                value="no"
                checked={formData.pointsMotivation === 'no'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'لا' : 'No'}</span>
            </label>
          </div>
        </div>

        {/* السؤال 10: تجربة المنصة */}
        <div className="border-t pt-4">
          <p className="text-lg font-medium mb-3">
            10. {isRTL ? 'إذا توفر محتوى عملي وتدريبات من شركات فعلية + فرص توظيف، هل ستجرب المنصة؟' : 'If practical content and training from real companies + job opportunities are available, would you try the platform?'}
          </p>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="tryPlatform"
                value="definitely"
                checked={formData.tryPlatform === 'definitely'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'بالتأكيد' : 'Definitely'}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="tryPlatform"
                value="maybe"
                checked={formData.tryPlatform === 'maybe'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'ممكن' : 'Maybe'}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="tryPlatform"
                value="no"
                checked={formData.tryPlatform === 'no'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>{isRTL ? 'لا' : 'No'}</span>
            </label>
          </div>
        </div>

        {/* زر الإرسال */}
        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              isRTL ? 'جاري الإرسال...' : 'Submitting...'
            ) : (
              isRTL ? 'إرسال الاستبيان' : 'Submit Survey'
            )}
          </button>
        </div>
      </form>

      <ThankYouModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isRTL={isRTL} />
    </div>
  );
}

export default SurveyForm;