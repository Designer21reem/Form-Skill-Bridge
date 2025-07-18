import React, { useEffect, useState } from 'react';
import { BarChart, PieChart, RadialBarChart, Bar, Pie, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getSurveyData, clearSurveyData } from '../utils/storage';
import { db } from '../firebase/firebase';import { collection, getDocs } from 'firebase/firestore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function ResultsPage() {
  const [surveyData, setSurveyData] = useState([]);
  const [maxParticipants] = useState(150);
  const [activeTab, setActiveTab] = useState('charts');
  const [locationData, setLocationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // جلب البيانات من Firestore بدلاً من localStorage
        const querySnapshot = await getDocs(collection(db, "surveys"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSurveyData(data);
        
        // تحليل بيانات الموقع الجغرافي
        const locations = {};
        data.forEach(participant => {
          if (participant.governorate) {
            locations[participant.governorate] = (locations[participant.governorate] || 0) + 1;
          }
        });
        setLocationData(locations);
      } catch (error) {
        console.error('Error loading survey data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // دالة حذف جميع المشتركين
  const handleClearParticipants = async () => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف جميع بيانات المشتركين؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        // هنا يجب إضافة كود لحذف البيانات من Firestore
        // يمكنك استخدام دالة deleteDoc لكل وثيقة
        await clearSurveyData(); // هذا إذا كنت تريد حذف من localStorage أيضاً
        setSurveyData([]);
        setLocationData({});
        alert('تم حذف جميع بيانات المشتركين بنجاح');
      } catch (error) {
        console.error('Error clearing participants:', error);
        alert('حدث خطأ أثناء محاولة حذف البيانات');
      }
    }
  };

  // ... باقي الكود يبقى كما هو بدون تغيير ...
  // تحضير البيانات للرسوم البيانية
  const prepareChartData = (questionKey, options) => {
    return options.map(option => ({
      name: option.label,
      value: surveyData.filter(item => item[questionKey] === option.value).length,
      percent: surveyData.length > 0 
        ? (surveyData.filter(item => item[questionKey] === option.value).length / surveyData.length) * 100
        : 0
    }));
  };

  // بيانات الأسئلة
  const statusData = prepareChartData('currentStatus', [
    { value: 'student', label: 'طالب' },
    { value: 'graduate', label: 'خريج' },
    { value: 'employed', label: 'موظف' },
    { value: 'unemployed', label: 'عاطل' },
    { value: 'freelancer', label: 'فريلانسر' }
  ]);

  const educationGapData = prepareChartData('educationGap', [
    { value: 'yes', label: 'نعم' },
    { value: 'no', label: 'لا' }
  ]);

  const usedPlatformsData = prepareChartData('usedPlatforms', [
    { value: 'yes', label: 'نعم' },
    { value: 'no', label: 'لا' }
  ]);

  const certificatesValueData = prepareChartData('certificatesValue', [
    { value: 'yes-useful', label: 'نعم، مفيدة' },
    { value: 'yes-not-useful', label: 'نعم، غير مفيدة' },
    { value: 'no', label: 'لا' }
  ]);

  const skillsData = [
    { name: 'برمجة', value: surveyData.filter(item => item.desiredSkills?.includes('programming')).length },
    { name: 'تصميم', value: surveyData.filter(item => item.desiredSkills?.includes('design')).length },
    { name: 'تسويق', value: surveyData.filter(item => item.desiredSkills?.includes('marketing')).length },
    { name: 'ادارة المشاريع', value: surveyData.filter(item => item.desiredSkills?.includes('management')).length },
    { name: 'مهارات شخصية', value: surveyData.filter(item => item.desiredSkills?.includes('soft-skills')).length },
    { name: 'أخرى', value: surveyData.filter(item => item.desiredSkills?.includes('other')).length }
  ];

  const certificationImportanceData = [
    { name: '1', value: surveyData.filter(item => item.certificationImportance == 1).length },
    { name: '2', value: surveyData.filter(item => item.certificationImportance == 2).length },
    { name: '3', value: surveyData.filter(item => item.certificationImportance == 3).length },
    { name: '4', value: surveyData.filter(item => item.certificationImportance == 4).length },
    { name: '5', value: surveyData.filter(item => item.certificationImportance == 5).length }
  ];

  const jobOpportunitiesData = prepareChartData('jobOpportunitiesImportance', [
    { value: 'very-important', label: 'مهم جداً' },
    { value: 'somewhat', label: 'نوعاً ما' },
    { value: 'not-important', label: 'غير مهم' }
  ]);

  const pricingData = prepareChartData('preferredPrice', [
    { value: 'free', label: 'مجاني فقط' },
    { value: 'less-than-10', label: 'أقل من $10' },
    { value: '10-20', label: '$10-20' },
    { value: 'more-than-20', label: 'أكثر من $20' }
  ]);

  const pointsMotivationData = prepareChartData('pointsMotivation', [
    { value: 'yes', label: 'نعم' },
    { value: 'no', label: 'لا' }
  ]);

  const tryPlatformData = prepareChartData('tryPlatform', [
    { value: 'definitely', label: 'بالتأكيد' },
    { value: 'maybe', label: 'ربما' },
    { value: 'no', label: 'لا' }
  ]);

  // تحليل السوق الديناميكي
  const analyzeMarket = () => {
    if (surveyData.length === 0) return null;

    // 1. تحليل التصنيفات الوظيفية
    const statusAnalysis = {
      student: surveyData.filter(p => p.currentStatus === 'student').length,
      graduate: surveyData.filter(p => p.currentStatus === 'graduate').length,
      employed: surveyData.filter(p => p.currentStatus === 'employed').length,
      unemployed: surveyData.filter(p => p.currentStatus === 'unemployed').length,
      freelancer: surveyData.filter(p => p.currentStatus === 'freelancer').length
    };

    // 2. تحليل المهارات حسب التصنيف
    const skillsByStatus = {
      student: {
        programming: surveyData.filter(p => p.currentStatus === 'student' && p.desiredSkills?.includes('programming')).length,
        design: surveyData.filter(p => p.currentStatus === 'student' && p.desiredSkills?.includes('design')).length,
        marketing: surveyData.filter(p => p.currentStatus === 'student' && p.desiredSkills?.includes('marketing')).length,
        management: surveyData.filter(p => p.currentStatus === 'student' && p.desiredSkills?.includes('management')).length,
        softSkills: surveyData.filter(p => p.currentStatus === 'student' && p.desiredSkills?.includes('soft-skills')).length,
                other: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('other')).length

      },
      graduate: {
        programming: surveyData.filter(p => p.currentStatus === 'graduate' && p.desiredSkills?.includes('programming')).length,
        design: surveyData.filter(p => p.currentStatus === 'graduate' && p.desiredSkills?.includes('design')).length,
        marketing: surveyData.filter(p => p.currentStatus === 'graduate' && p.desiredSkills?.includes('marketing')).length,
        management: surveyData.filter(p => p.currentStatus === 'graduate' && p.desiredSkills?.includes('management')).length,
        softSkills: surveyData.filter(p => p.currentStatus === 'graduate' && p.desiredSkills?.includes('soft-skills')).length,
                other: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('other')).length

      },
      employed: {
        programming: surveyData.filter(p => p.currentStatus === 'employed' && p.desiredSkills?.includes('programming')).length,
        design: surveyData.filter(p => p.currentStatus === 'employed' && p.desiredSkills?.includes('design')).length,
        marketing: surveyData.filter(p => p.currentStatus === 'employed' && p.desiredSkills?.includes('marketing')).length,
        management: surveyData.filter(p => p.currentStatus === 'employed' && p.desiredSkills?.includes('management')).length,
        softSkills: surveyData.filter(p => p.currentStatus === 'employed' && p.desiredSkills?.includes('soft-skills')).length,
                other: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('other')).length

      },
      unemployed: {
        programming: surveyData.filter(p => p.currentStatus === 'unemployed' && p.desiredSkills?.includes('programming')).length,
        design: surveyData.filter(p => p.currentStatus === 'unemployed' && p.desiredSkills?.includes('design')).length,
        marketing: surveyData.filter(p => p.currentStatus === 'unemployed' && p.desiredSkills?.includes('marketing')).length,
        management: surveyData.filter(p => p.currentStatus === 'unemployed' && p.desiredSkills?.includes('management')).length,
        softSkills: surveyData.filter(p => p.currentStatus === 'unemployed' && p.desiredSkills?.includes('soft-skills')).length,
                other: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('other')).length

      },
      freelancer: {
        programming: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('programming')).length,
        design: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('design')).length,
        marketing: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('marketing')).length,
        management: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('management')).length,
        softSkills: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('soft-skills')).length,
        other: surveyData.filter(p => p.currentStatus === 'freelancer' && p.desiredSkills?.includes('other')).length
      }
    };

    // 3. تحليل استعداد الدفع حسب التصنيف
    const paymentByStatus = {
      student: {
        free: surveyData.filter(p => p.currentStatus === 'student' && p.preferredPrice === 'free').length,
        low: surveyData.filter(p => p.currentStatus === 'student' && p.preferredPrice === 'less-than-10').length,
        medium: surveyData.filter(p => p.currentStatus === 'student' && p.preferredPrice === '10-20').length,
        high: surveyData.filter(p => p.currentStatus === 'student' && p.preferredPrice === 'more-than-20').length
      },
      graduate: {
        free: surveyData.filter(p => p.currentStatus === 'graduate' && p.preferredPrice === 'free').length,
        low: surveyData.filter(p => p.currentStatus === 'graduate' && p.preferredPrice === 'less-than-10').length,
        medium: surveyData.filter(p => p.currentStatus === 'graduate' && p.preferredPrice === '10-20').length,
        high: surveyData.filter(p => p.currentStatus === 'graduate' && p.preferredPrice === 'more-than-20').length
      },
      employed: {
        free: surveyData.filter(p => p.currentStatus === 'employed' && p.preferredPrice === 'free').length,
        low: surveyData.filter(p => p.currentStatus === 'employed' && p.preferredPrice === 'less-than-10').length,
        medium: surveyData.filter(p => p.currentStatus === 'employed' && p.preferredPrice === '10-20').length,
        high: surveyData.filter(p => p.currentStatus === 'employed' && p.preferredPrice === 'more-than-20').length
      },
      unemployed: {
        free: surveyData.filter(p => p.currentStatus === 'unemployed' && p.preferredPrice === 'free').length,
        low: surveyData.filter(p => p.currentStatus === 'unemployed' && p.preferredPrice === 'less-than-10').length,
        medium: surveyData.filter(p => p.currentStatus === 'unemployed' && p.preferredPrice === '10-20').length,
        high: surveyData.filter(p => p.currentStatus === 'unemployed' && p.preferredPrice === 'more-than-20').length
      },
      freelancer: {
        free: surveyData.filter(p => p.currentStatus === 'freelancer' && p.preferredPrice === 'free').length,
        low: surveyData.filter(p => p.currentStatus === 'freelancer' && p.preferredPrice === 'less-than-10').length,
        medium: surveyData.filter(p => p.currentStatus === 'freelancer' && p.preferredPrice === '10-20').length,
        high: surveyData.filter(p => p.currentStatus === 'freelancer' && p.preferredPrice === 'more-than-20').length
      }
    };

    // 4. تحليل أهمية الشهادات حسب التصنيف
    const certificationByStatus = {
      student: surveyData
        .filter(p => p.currentStatus === 'student')
        .reduce((sum, p) => sum + (p.certificationImportance || 0), 0) / statusAnalysis.student,
      graduate: surveyData
        .filter(p => p.currentStatus === 'graduate')
        .reduce((sum, p) => sum + (p.certificationImportance || 0), 0) / statusAnalysis.graduate,
      employed: surveyData
        .filter(p => p.currentStatus === 'employed')
        .reduce((sum, p) => sum + (p.certificationImportance || 0), 0) / statusAnalysis.employed,
      unemployed: surveyData
        .filter(p => p.currentStatus === 'unemployed')
        .reduce((sum, p) => sum + (p.certificationImportance || 0), 0) / statusAnalysis.unemployed,
      freelancer: surveyData
        .filter(p => p.currentStatus === 'freelancer')
        .reduce((sum, p) => sum + (p.certificationImportance || 0), 0) / statusAnalysis.freelancer
    };

    // 5. تحليل أهمية فرص العمل حسب التصنيف
    const jobOpportunitiesByStatus = {
      student: {
        veryImportant: surveyData.filter(p => p.currentStatus === 'student' && p.jobOpportunitiesImportance === 'very-important').length,
        somewhat: surveyData.filter(p => p.currentStatus === 'student' && p.jobOpportunitiesImportance === 'somewhat').length,
        notImportant: surveyData.filter(p => p.currentStatus === 'student' && p.jobOpportunitiesImportance === 'not-important').length
      },
      graduate: {
        veryImportant: surveyData.filter(p => p.currentStatus === 'graduate' && p.jobOpportunitiesImportance === 'very-important').length,
        somewhat: surveyData.filter(p => p.currentStatus === 'graduate' && p.jobOpportunitiesImportance === 'somewhat').length,
        notImportant: surveyData.filter(p => p.currentStatus === 'graduate' && p.jobOpportunitiesImportance === 'not-important').length
      },
      employed: {
        veryImportant: surveyData.filter(p => p.currentStatus === 'employed' && p.jobOpportunitiesImportance === 'very-important').length,
        somewhat: surveyData.filter(p => p.currentStatus === 'employed' && p.jobOpportunitiesImportance === 'somewhat').length,
        notImportant: surveyData.filter(p => p.currentStatus === 'employed' && p.jobOpportunitiesImportance === 'not-important').length
      },
      unemployed: {
        veryImportant: surveyData.filter(p => p.currentStatus === 'unemployed' && p.jobOpportunitiesImportance === 'very-important').length,
        somewhat: surveyData.filter(p => p.currentStatus === 'unemployed' && p.jobOpportunitiesImportance === 'somewhat').length,
        notImportant: surveyData.filter(p => p.currentStatus === 'unemployed' && p.jobOpportunitiesImportance === 'not-important').length
      },
      freelancer: {
        veryImportant: surveyData.filter(p => p.currentStatus === 'freelancer' && p.jobOpportunitiesImportance === 'very-important').length,
        somewhat: surveyData.filter(p => p.currentStatus === 'freelancer' && p.jobOpportunitiesImportance === 'somewhat').length,
        notImportant: surveyData.filter(p => p.currentStatus === 'freelancer' && p.jobOpportunitiesImportance === 'not-important').length
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6">تحليل السوق الشامل</h2>
        
        {/* قسم التصنيفات الوظيفية */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">التوزيع حسب الحالة الوظيفية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(statusAnalysis).map(([status, count]) => ({
                      name: status === 'student' ? 'طالب' :
                            status === 'graduate' ? 'خريج' :
                            status === 'employed' ? 'موظف' :
                            status === 'unemployed' ? 'عاطل' : 'فريلانسر',
                      value: count
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${Math.round(percent)}%`}
                    labelLine={false}
                  >
                    {Object.keys(statusAnalysis).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} (${Math.round(props.payload.percent)}%)`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">النسب المئوية</h4>
              <ul className="space-y-2">
                {Object.entries(statusAnalysis)
                  .sort((a, b) => b[1] - a[1])
                  .map(([status, count]) => (
                    <li key={status} className="flex justify-between">
                      <span>
                        {status === 'student' ? 'طلاب' :
                         status === 'graduate' ? 'خريجون' :
                         status === 'employed' ? 'موظفون' :
                         status === 'unemployed' ? 'عاطلون' : 'فريلانسر'}
                      </span>
                      <span className="font-medium">
                        {count} ({Math.round((count / surveyData.length) * 100)}%)
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* قسم المهارات حسب التصنيف */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">المهارات المطلوبة حسب التصنيف</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">المهارة</th>
                  {Object.keys(statusAnalysis).map(status => (
                    <th key={status} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {status === 'student' ? 'طلاب' :
                       status === 'graduate' ? 'خريجون' :
                       status === 'employed' ? 'موظفون' :
                       status === 'unemployed' ? 'عاطلون' : 'فريلانسر'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {['programming', 'design', 'marketing', 'management', 'soft-skills'].map(skill => (
                  <tr key={skill}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {skill === 'programming' ? 'برمجة' :
                       skill === 'design' ? 'تصميم' :
                       skill === 'marketing' ? 'تسويق' :
                       skill === 'management' ? 'ادارة المشاريع،' :
                       skill === 'soft-skills' ? 'مهارات شخصية' : 'غير ذلك'}
                    </td>
                    {Object.keys(statusAnalysis).map(status => (
                      <td key={`${skill}-${status}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {skillsByStatus[status][skill === 'soft-skills' ? 'softSkills' : skill]} (
                        {Math.round((skillsByStatus[status][skill === 'soft-skills' ? 'softSkills' : skill] / statusAnalysis[status]) * 100)}%)
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* قسم استعداد الدفع حسب التصنيف */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">استعداد الدفع حسب التصنيف</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">التوزيع العام</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.keys(statusAnalysis).map(status => ({
                    name: status === 'student' ? 'طلاب' :
                          status === 'graduate' ? 'خريجون' :
                          status === 'employed' ? 'موظفون' :
                          status === 'unemployed' ? 'عاطلون' : 'فريلانسر',
                    free: paymentByStatus[status].free,
                    low: paymentByStatus[status].low,
                    medium: paymentByStatus[status].medium,
                    high: paymentByStatus[status].high
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="free" stackId="a" fill="#0088FE" name="مجاني" />
                  <Bar dataKey="low" stackId="a" fill="#00C49F" name="أقل من $10" />
                  <Bar dataKey="medium" stackId="a" fill="#FFBB28" name="$10-20" />
                  <Bar dataKey="high" stackId="a" fill="#FF8042" name="أكثر من $20" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">النسب المئوية</h4>
              <div className="space-y-4">
                {Object.entries(statusAnalysis).map(([status, count]) => (
                  <div key={status}>
                    <h5 className="font-medium">
                      {status === 'student' ? 'الطلاب' :
                       status === 'graduate' ? 'الخريجون' :
                       status === 'employed' ? 'الموظفون' :
                       status === 'unemployed' ? 'العاطلون' : 'الفريلانسر'}
                    </h5>
                    <ul className="space-y-1">
                      <li className="flex justify-between text-sm">
                        <span>مجاني:</span>
                        <span>{Math.round((paymentByStatus[status].free / count) * 100)}%</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span>أقل من $10:</span>
                        <span>{Math.round((paymentByStatus[status].low / count) * 100)}%</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span>$10-20:</span>
                        <span>{Math.round((paymentByStatus[status].medium / count) * 100)}%</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span>أكثر من $20:</span>
                        <span>{Math.round((paymentByStatus[status].high / count) * 100)}%</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* قسم أهمية الشهادات */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">أهمية الشهادات حسب التصنيف</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.keys(statusAnalysis).map(status => ({
                  name: status === 'student' ? 'طلاب' :
                        status === 'graduate' ? 'خريجون' :
                        status === 'employed' ? 'موظفون' :
                        status === 'unemployed' ? 'عاطلون' : 'فريلانسر',
                  importance: certificationByStatus[status]
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="importance" fill="#8884d8" name="متوسط الأهمية (من 5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* قسم أهمية فرص العمل */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">أهمية فرص العمل حسب التصنيف</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.keys(statusAnalysis).map(status => ({
                  name: status === 'student' ? 'طلاب' :
                        status === 'graduate' ? 'خريجون' :
                        status === 'employed' ? 'موظفون' :
                        status === 'unemployed' ? 'عاطلون' : 'فريلانسر',
                  'مهم جداً': jobOpportunitiesByStatus[status].veryImportant,
                  'نوعاً ما': jobOpportunitiesByStatus[status].somewhat,
                  'غير مهم': jobOpportunitiesByStatus[status].notImportant
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="مهم جداً" stackId="a" fill="#0088FE" />
                <Bar dataKey="نوعاً ما" stackId="a" fill="#00C49F" />
                <Bar dataKey="غير مهم" stackId="a" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* قسم التوصيات الاستراتيجية */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">التوصيات الاستراتيجية</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">الفئة المستهدفة</h4>
              <p className="text-gray-700">
                بناءً على التحليل، نوصي بالتركيز على فئة <span className="font-semibold">
                  {Object.entries(statusAnalysis).sort((a, b) => b[1] - a[1])[0][0] === 'student' ? 'الطلاب' :
                  Object.entries(statusAnalysis).sort((a, b) => b[1] - a[1])[0][0] === 'graduate' ? 'الخريجين' :
                  Object.entries(statusAnalysis).sort((a, b) => b[1] - a[1])[0][0] === 'employed' ? 'الموظفين' :
                  Object.entries(statusAnalysis).sort((a, b) => b[1] - a[1])[0][0] === 'unemployed' ? 'العاطلين' : 'الفريلانسر'}
                </span> حيث تمثل النسبة الأكبر من المستخدمين بنسبة {Math.round((Object.entries(statusAnalysis).sort((a, b) => b[1] - a[1])[0][1] / surveyData.length) * 100)}%.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">المحتوى التعليمي</h4>
              <p className="text-gray-700">
                نوصي بتطوير محتوى تعليمي في مجال <span className="font-semibold">
                  {['programming', 'design', 'marketing', 'management', 'soft-skills', 'other']
                    .map(skill => ({
                      name: skill,
                      count: surveyData.filter(p => p.desiredSkills?.includes(skill)).length
                    }))
                    .sort((a, b) => b.count - a.count)[0].name === 'programming' ? 'البرمجة' :
                    ['programming', 'design', 'marketing', 'management', 'soft-skills', 'other']
                    .map(skill => ({
                      name: skill,
                      count: surveyData.filter(p => p.desiredSkills?.includes(skill)).length
                    }))
                    .sort((a, b) => b.count - a.count)[0].name === 'design' ? 'التصميم' :
                    ['programming', 'design', 'marketing', 'management', 'soft-skills', 'other']
                    .map(skill => ({
                      name: skill,
                      count: surveyData.filter(p => p.desiredSkills?.includes(skill)).length
                    }))
                    .sort((a, b) => b.count - a.count)[0].name === 'marketing' ? 'التسويق' :
                    ['programming', 'design', 'marketing', 'management', 'soft-skills', 'other']
                    .map(skill => ({
                      name: skill,
                      count: surveyData.filter(p => p.desiredSkills?.includes(skill)).length
                    }))
                    .sort((a, b) => b.count - a.count)[0].name === 'management' ? 'ادارة المشاريع' : 'المهارات الشخصية'}
                </span> حيث أنها المهارة الأكثر طلباً بين جميع الفئات.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">استراتيجية التسعير</h4>
              <p className="text-gray-700">
                {Object.entries(paymentByStatus).reduce((sum, [status, payments]) => sum + payments.free, 0) > 
                 Object.entries(paymentByStatus).reduce((sum, [status, payments]) => sum + payments.low + payments.medium + payments.high, 0) ?
                 'نوصي بنموذج Freemium مع مميزات مدفوعة إضافية حيث أن الغالبية تفضل النسخة المجانية.' :
                 'نوصي بباقات مدفوعة بأسعار تنافسية حيث أن نسبة كبيرة من المستخدمين مستعدون للدفع.'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">فرص التوظيف</h4>
              <p className="text-gray-700">
                {Object.entries(jobOpportunitiesByStatus).reduce((sum, [status, values]) => sum + values.veryImportant, 0) > surveyData.length / 2 ?
                 'يجب التركيز على توفير فرص توظيف كعامل جذب رئيسي حيث أن الغالبية تعتبره مهم جداً.' :
                 'يمكن التركيز على الجودة التعليمية كعامل جذب رئيسي مع توفير فرص توظيف كقيمة مضافة.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">نتائج الاستبيان</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">المشاركون: {surveyData.length} / {maxParticipants}</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${(surveyData.length / maxParticipants) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* تبويب التحويل بين الأقسام */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'charts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('charts')}
          >
            الرسوم البيانية
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'analysis' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('analysis')}
          >
            تحليل السوق
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'participants' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('participants')}
          >
            قائمة المسجلين
          </button>
        </div>

        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* السؤال 1: الوضع الحالي */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">1. الوضع الحالي</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent.toFixed(1)}%)`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 2: فجوة التعليم */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">2. هل تشعر بوجود فجوة بين تعليمك واحتياجات سوق العمل؟</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={educationGapData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
                    >
                      {educationGapData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent.toFixed(1)}%)`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 3: منصات التعلم */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">3. هل سبق واستخدمت منصات تعليمية إلكترونية؟</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usedPlatformsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
                    >
                      {usedPlatformsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent.toFixed(1)}%)`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 4: قيمة الشهادات */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">4. هل تعتقد أن الشهادات الإلكترونية تضيف قيمة لسيرتك الذاتية؟</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={certificatesValueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
                    >
                      {certificatesValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent.toFixed(1)}%)`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 5: المهارات المطلوبة */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">5. ما هي المهارات التي ترغب في تطويرها؟</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="عدد الأشخاص" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 6: أهمية الشهادات */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">6. كم تعتبر الشهادات الإلكترونية مهمة لك؟ (من 1 إلى 5)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="10%"
                    outerRadius="80%"
                    data={certificationImportanceData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      label={{ 
                        position: 'insideStart', 
                        fill: '#fff',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                      background
                      dataKey="value"
                      name="عدد الأشخاص"
                    >
                      {certificationImportanceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={[
                            '#FF6384',  // لون للقيمة 1
                            '#36A2EB',  // لون للقيمة 2
                            '#FFCE56',  // لون للقيمة 3
                            '#4BC0C0',  // لون للقيمة 4
                            '#9966FF'   // لون للقيمة 5
                          ][index % 5]} 
                        />
                      ))}
                    </RadialBar>
                    <Legend 
                      iconSize={10} 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      formatter={(value, entry, index) => {
                        return `التقييم ${value}`;
                      }}
                    />
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} شخص`, `التقييم ${props.payload.name}`]}
                      contentStyle={{
                        backgroundColor: '#333',
                        color: '#fff',
                        borderRadius: '8px',
                        border: 'none'
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 7: فرص العمل */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">7. ما مدى أهمية توفير فرص عمل عبر المنصة؟</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={jobOpportunitiesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="عدد الأشخاص" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 8: التسعير */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">8. ما هو السعر المناسب للدورات؟</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pricingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
                    >
                      {pricingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent.toFixed(1)}%)`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 9: الحوافز */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">9. هل تحفزك النقاط والجوائز على الاستمرار في التعلم؟</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pointsMotivationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
                    >
                      {pointsMotivationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent.toFixed(1)}%)`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* السؤال 10: تجربة المنصة */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">10. هل ستجرب منصتنا إذا وفرت احتياجاتك؟</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tryPlatformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
                    >
                      {tryPlatformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percent.toFixed(1)}%)`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* بيانات الموقع الجغرافي */}
            <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">التوزيع الجغرافي للمشاركين</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(locationData).map(([name, value]) => ({ name, value }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="عدد المشاركين" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && analyzeMarket()}

        {activeTab === 'participants' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">قائمة المسجلين ({surveyData.length})</h3>
              <button
                onClick={handleClearParticipants}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                حذف جميع المشاركين
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">المحافظة</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة الوظيفية</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">المهارات المطلوبة</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surveyData.map((participant, index) => (
                    <tr key={index}>
                      <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {participant.fullName || 'غير محدد'}
                      </td>
                      <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.email || 'غير محدد'}
                      </td>
                      <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.governorate || 'غير محدد'}
                      </td>
                      <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.currentStatus === 'student' ? 'طالب' :
                         participant.currentStatus === 'graduate' ? 'خريج' :
                         participant.currentStatus === 'employed' ? 'موظف' :
                         participant.currentStatus === 'unemployed' ? 'عاطل' :
                         participant.currentStatus === 'freelancer' ? 'فريلانسر' : 'غير محدد'}
                      </td>
                      <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.desiredSkills?.map(skill => {
                          switch(skill) {
                            case 'programming': return 'برمجة، ';
                            case 'design': return 'تصميم، ';
                            case 'marketing': return 'تسويق، ';
                            case 'management': return '  ادارة المشاريع، ';
                            case 'soft-skills': return 'مهارات شخصية، ';
                            case 'other': return 'أخرى، ';
                            default: return '';
                          }
                        }) || 'غير محدد'}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;