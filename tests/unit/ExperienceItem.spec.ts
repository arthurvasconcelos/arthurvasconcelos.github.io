// import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import ExperienceItem from "@/components/ExperienceItem.vue";

describe("ExperienceItem.vue", () => {
  let defaultProps = {};

  beforeEach(() => {
    defaultProps = {
      logo: "genius-sports.png",
      role: "Test Role",
      name: "Test Company",
      description: "Lorem Ipsum",
      join: "2019-01-01",
      leave: null
    }
  });

  it("renders with success", () => {
    const wrapper = shallowMount(ExperienceItem, {
      propsData: {...defaultProps},
      mocks: {
        jobDuration: () => {}
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("render correct title", () => {
    const wrapper = shallowMount(ExperienceItem, {
      propsData: {...defaultProps},
      mocks: {
        jobDuration: () => {}
      }
    });

    expect(wrapper.find("h2").text()).toBe(`${defaultProps.role} @ ${defaultProps.name}`);
  });

  it("render correct description", () => {
    const wrapper = shallowMount(ExperienceItem, {
      propsData: {...defaultProps},
      mocks: {
        jobDuration: () => {}
      }
    });

    expect(wrapper.find(".experienceGrid-item-data-description").text()).toBe(defaultProps.description);
  });
});
