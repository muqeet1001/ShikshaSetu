import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

interface SelectItem {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

// Context to pass data between Select components
const SelectContext = React.createContext<{
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: SelectItem[];
  setItems: (items: SelectItem[]) => void;
}>({
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
  items: [],
  setItems: () => {},
});

export function Select({ value, onValueChange, placeholder, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SelectItem[]>([]);

  return (
    <SelectContext.Provider value={{
      value,
      onValueChange,
      placeholder,
      isOpen,
      setIsOpen,
      items,
      setItems
    }}>
      <View style={styles.selectContainer}>
        {children}
      </View>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children }: SelectTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  return (
    <TouchableOpacity
      style={styles.selectTrigger}
      onPress={() => setIsOpen(!isOpen)}
      activeOpacity={0.7}
    >
      {children}
      <Text style={styles.selectArrow}>{isOpen ? '▲' : '▼'}</Text>
    </TouchableOpacity>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value, items } = React.useContext(SelectContext);
  const selectedItem = items.find(item => item.value === value);
  
  return (
    <Text style={[styles.selectValue, !selectedItem && styles.placeholder]}>
      {selectedItem ? selectedItem.label : placeholder}
    </Text>
  );
}

export function SelectContent({ children }: SelectContentProps) {
  const { isOpen, setIsOpen, items, onValueChange, setItems } = React.useContext(SelectContext);

  // Extract items from children
  React.useEffect(() => {
    const extractedItems: SelectItem[] = [];
    React.Children.forEach(children, (child: React.ReactNode) => {
      if (React.isValidElement(child) && (child as any).props.value) {
        extractedItems.push({
          value: (child as any).props.value,
          label: typeof (child as any).props.children === 'string' ? (child as any).props.children : (child as any).props.value as string
        });
      }
    });
    setItems(extractedItems);
  }, [children, setItems]);

  const handleSelectItem = (item: SelectItem) => {
    onValueChange(item.value);
    setIsOpen(false);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsOpen(false)}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.selectItem}
                onPress={() => handleSelectItem(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.selectItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export function SelectItem({ value, children }: SelectItemProps) {
  // This component is used to define the structure but actual rendering happens in SelectContent
  return null;
}

const styles = StyleSheet.create({
  selectContainer: {
    position: 'relative',
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  selectValue: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  placeholder: {
    color: '#6b7280',
  },
  selectArrow: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxHeight: 300,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  selectItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectItemText: {
    fontSize: 16,
    color: '#1f2937',
  },
});