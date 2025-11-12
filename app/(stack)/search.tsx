import React, { useState } from 'react';
import { AppContainer } from '@/components/app/app-container';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView, Keyboard } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(['반팔티', '슬랙스', '블라우스']);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim() === '') return;
    setSearched(true);
    if (!recent.includes(query)) {
      setRecent((prev) => [query, ...prev.slice(0, 4)]);
    }
    Keyboard.dismiss();
  };

  const handleRemoveRecent = (keyword: string) => {
    setRecent((prev) => prev.filter((item) => item !== keyword));
  };

  const popularKeywords = [
    { word: '반팔티', trend: 'up' },
    { word: '롱스커트', trend: 'down' },
    { word: '슬랙스', trend: 'up' },
    { word: '블라우스', trend: 'same' },
    { word: '반바지', trend: 'up' },
    { word: '니트', trend: 'down' },
    { word: '청바지', trend: 'same' },
    { word: '셔츠', trend: 'up' },
    { word: '가디건', trend: 'same' },
    { word: '민소매', trend: 'down' },
  ];

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <FontAwesome name="chevron-up" size={14} className="text-red-500" />;
    if (trend === 'down') return <FontAwesome name="chevron-down" size={14} className="text-blue-500" />;
    return <FontAwesome name="minus" size={14} className="text-gray-400" />;
  };

  return (
    <AppContainer headerTitle="검색" showBackButton>
      <Box className="flex-1 bg-white px-4 pt-4">
        <Box className="mb-4">
          <Input
            className="text-base"
          />
        </Box>

        <ScrollView keyboardShouldPersistTaps="handled">
          {/* 최근 검색어 */}
          {recent.length > 0 && (
            <Box className="mb-6">
              <Text bold className="text-sm mb-3">최근 검색어</Text>
              <Box className="space-y-2">
                {recent.map((item, i) => (
                  <Box key={i} className="flex-row justify-between items-center">
                    <Pressable
                      onPress={() => {
                        setQuery(item);
                        setSearched(true);
                      }}
                    >
                      <Text className="text-sm">{item}</Text>
                    </Pressable>
                    <Pressable onPress={() => handleRemoveRecent(item)}>
                      <FontAwesome name="times" size={18} className="text-gray-400" />
                    </Pressable>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* 인기 검색어 */}
          <Box className="mb-6">
            <Text bold className="text-sm mb-3">인기 검색어</Text>
            {popularKeywords.map((item, index) => (
              <Box key={index} className="flex-row justify-between items-center py-2 border-b">
                <Box className="flex-row items-center space-x-3">
                  <Text className="text-sm text-gray-400">{index + 1}</Text>
                  <Text className="text-sm">{item.word}</Text>
                </Box>
                <TrendIcon trend={item.trend} />
              </Box>
            ))}
          </Box>

          {/* 검색 결과 (선택사항) */}
          {searched && (
            <Box className="pt-6">
              <Text bold className="text-sm mb-2">‘{query}’ 검색 결과</Text>
              <Text className="text-gray-400 text-sm">※ 실제 검색 결과는 API 연동 필요</Text>
            </Box>
          )}
        </ScrollView>
      </Box>
    </AppContainer>
  );
}
