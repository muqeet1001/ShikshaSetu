import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardContent } from '../ui/card';
import { colors } from '../../theme/colors';

interface FlowchartTextOutlineProps {
  careerCategory: string;
  flowData: any; // Using any for simplicity, but should be properly typed in a real app
}

export function FlowchartTextOutline({ careerCategory, flowData }: FlowchartTextOutlineProps) {
  const renderNode = (nodeId: string, level: number = 0) => {
    const node = flowData[nodeId];
    if (!node) return null;
    
    const indent = '  '.repeat(level);
    
    return (
      <View key={nodeId} style={styles.nodeContainer}>
        <Text style={styles.nodeText}>
          {indent}• <Text style={styles.nodeTitleText}>{node.title}</Text>
          {node.type === 'study' && (
            <Text style={styles.nodeDetailText}> ({node.duration})</Text>
          )}
        </Text>
        
        {node.pros && node.pros.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>{indent}  Pros:</Text>
            {node.pros.map((pro: string, index: number) => (
              <Text key={`pro-${index}`} style={styles.listItem}>
                {indent}    - {pro}
              </Text>
            ))}
          </View>
        )}
        
        {node.cons && node.cons.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>{indent}  Cons:</Text>
            {node.cons.map((con: string, index: number) => (
              <Text key={`con-${index}`} style={styles.listItem}>
                {indent}    - {con}
              </Text>
            ))}
          </View>
        )}
        
        {node.children && node.children.length > 0 && (
          <View style={styles.childrenContainer}>
            {node.children.map((childId: string) => renderNode(childId, level + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <CardContent>
        <Text style={styles.title}>{careerCategory} Career Pathway - Text Outline</Text>
        <Text style={styles.description}>
          This is a text-based representation of the career flowchart for accessibility purposes.
        </Text>
        
        {flowData.start && renderNode('start')}
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[800],
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
  },
  nodeContainer: {
    marginBottom: 12,
  },
  nodeText: {
    fontSize: 15,
    color: colors.gray[800],
    marginBottom: 4,
  },
  nodeTitleText: {
    fontWeight: '600',
  },
  nodeDetailText: {
    fontStyle: 'italic',
    color: colors.gray[600],
  },
  listContainer: {
    marginVertical: 4,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 2,
  },
  listItem: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 2,
  },
  childrenContainer: {
    marginTop: 8,
    marginLeft: 8,
  },
});