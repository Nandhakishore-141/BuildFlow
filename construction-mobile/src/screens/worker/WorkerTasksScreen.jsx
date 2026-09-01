import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/common/AppHeader';
import { AppBadge } from '../../components/common/AppBadge';
import { AppButton } from '../../components/common/AppButton';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as workerService from '../../services/workerService';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
} from 'lucide-react-native';

export const WorkerTasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Complete Task Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await workerService.getTasks();
      setTasks(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load worker tasks:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      await workerService.updateTaskStatus(selectedTask.id, {
        status: 'Completed',
        notes: completionNotes,
      });

      Alert.alert('Task Completed!', `Task "${selectedTask.title}" has been marked as finished.`);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading Field Tasks..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Field Task Checklist"
        subtitle={`${tasks.length} Assigned Tasks`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {tasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="No Tasks Assigned"
            description="Your lead contractor will assign trade milestones and daily site tasks to your checklist."
          />
        ) : (
          tasks.map((task) => {
            const isDone = task.status === 'Completed';

            return (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskTop}>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskSub}>
                      {task.project_name || 'Building Site'} • Due: {task.due_date ? task.due_date.substring(0, 10) : 'End of Shift'}
                    </Text>
                  </View>
                  <AppBadge
                    label={task.status || 'Pending'}
                    variant={isDone ? 'Completed' : 'warning'}
                  />
                </View>

                {task.description ? (
                  <Text style={styles.taskDesc}>{task.description}</Text>
                ) : null}

                {!isDone && (
                  <AppButton
                    title="Mark as Completed"
                    icon={CheckCircle2}
                    size="sm"
                    onPress={() => setSelectedTask(task)}
                    style={styles.completeBtn}
                  />
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Complete Task Modal */}
      <AppModal
        visible={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Complete Task"
        subtitle={selectedTask?.title}
        footer={
          <>
            <AppButton title="Cancel" variant="outline" size="sm" onPress={() => setSelectedTask(null)} />
            <AppButton title="Confirm Finished" size="sm" onPress={handleCompleteTask} isLoading={isSubmitting} />
          </>
        }
      >
        <AppInput
          label="Completion Notes / Handover Remarks"
          value={completionNotes}
          onChangeText={setCompletionNotes}
          placeholder="e.g. Masonry alignment finished up to lintel beam level."
          multiline
          numberOfLines={3}
        />
      </AppModal>
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
  taskCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 12,
  },
  taskTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral950,
  },
  taskSub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  taskDesc: {
    fontSize: 12,
    color: colors.neutral700,
    lineHeight: 16,
    marginBottom: 10,
  },
  completeBtn: {
    marginTop: 4,
  },
});
