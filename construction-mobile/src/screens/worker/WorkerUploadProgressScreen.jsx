import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as workerService from '../../services/workerService';
import * as projectService from '../../services/projectService';
import { Camera, Building2, Send, CheckCircle2 } from 'lucide-react-native';

export const WorkerUploadProgressScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getProjects({ limit: 50 });
        const rawProjects = res.data?.data?.data || res.data?.data || res.data || [];
        const list = Array.isArray(rawProjects) ? rawProjects : (Array.isArray(rawProjects?.data) ? rawProjects.data : []);
        setProjects(list);
        if (list.length > 0) setProjectId(list[0].id);
      } catch (err) {
        console.error('Failed to load projects for progress upload:', err);
      }
    };
    fetchProjects();
  }, []);

  const handleUpload = async () => {
    if (!projectId || !description) {
      Alert.alert('Required Fields', 'Please select a project site and write a description of today\'s work.');
      return;
    }

    setIsSubmitting(true);
    try {
      await workerService.createProgress({
        project_id: projectId,
        description,
        file_url: photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800',
        file_type: 'Photo',
      });

      Alert.alert(
        'Progress Uploaded!',
        'Your site progress update and photo have been submitted for contractor verification.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Upload Failed', err.response?.data?.message || 'Failed to submit progress update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Upload Site Progress"
        subtitle="Submit Photos & Milestone Updates"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard title="Site Verification Submission">
          <Text style={styles.fieldLabel}>Select Building Project:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectPills}>
            {projects.map((p) => {
              const active = p.id === projectId;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setProjectId(p.id)}
                  style={[styles.pill, active ? styles.pillActive : null]}
                >
                  <Building2 size={14} color={active ? colors.white : colors.neutral700} />
                  <Text style={[styles.pillText, active ? styles.pillTextActive : null]}>
                    {p.project_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <AppInput
            label="Work Description & Activity Completed *"
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Completed second floor slab rebar layout and electrical conduits inspection."
            multiline
            numberOfLines={4}
          />

          <AppInput
            label="Photo URL / Camera Reference"
            value={photoUrl}
            onChangeText={setPhotoUrl}
            placeholder="https://... or site camera upload"
            leftIcon={Camera}
          />

          <AppButton
            title="Submit Progress for Contractor Approval"
            onPress={handleUpload}
            isLoading={isSubmitting}
            icon={Send}
            size="lg"
            style={{ marginTop: 10 }}
          />
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral700,
    marginBottom: 8,
  },
  projectPills: {
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.neutral100,
    borderWidth: 1,
    borderColor: colors.neutral200,
    gap: 6,
  },
  pillActive: {
    backgroundColor: colors.gold500,
    borderColor: colors.gold500,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral700,
  },
  pillTextActive: {
    color: colors.white,
  },
});
