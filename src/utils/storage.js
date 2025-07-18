// storage.js
import { db } from '../firebase/firebase'; // إذا كان في مجلد فرعي
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const SURVEY_DATA_KEY = 'survey-results'; // يمكن الاحتفاظ بهذا الثابت للتوافق مع الكود القديم

export const saveSurveyData = async (data) => {
  try {
    // حفظ البيانات في Firestore
    const docRef = await addDoc(collection(db, "surveys"), {
      ...data,
      createdAt: new Date()
    });
    
    // يمكن الاحتفاظ بالنسخة المحلية إذا كنت بحاجة إليها
    const existingLocalData = JSON.parse(localStorage.getItem(SURVEY_DATA_KEY) || '[]');
    localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify([...existingLocalData, data]));
    
    return docRef.id;
  } catch (e) {
    console.error("Error saving survey data: ", e);
    throw e;
  }
};

export const getSurveyData = async () => {
  try {
    // جلب البيانات من Firestore
    const querySnapshot = await getDocs(collection(db, "surveys"));
    const firebaseData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // يمكن الاحتفاظ بالبيانات المحلية للتوافق
    const localData = JSON.parse(localStorage.getItem(SURVEY_DATA_KEY) || '[]');
    
    // دمج البيانات من المصدرين إذا لزم الأمر
    return [...firebaseData, ...localData];
  } catch (e) {
    console.error("Error getting survey data: ", e);
    return JSON.parse(localStorage.getItem(SURVEY_DATA_KEY) || '[]');
  }
};

export const clearSurveyData = async () => {
  try {
    // حذف البيانات من Firestore (اختياري)
    // ملاحظة: هذا سيحتاج إلى تنفيذ مختلف إذا كنت تريد حذف جميع المستندات
    // يمكنك تخطي هذا الجزء إذا كنت لا تريد حذف بيانات Firestore
    
    // حذف البيانات المحلية
    localStorage.removeItem(SURVEY_DATA_KEY);
    return true;
  } catch (e) {
    console.error("Error clearing survey data: ", e);
    return false;
  }
};